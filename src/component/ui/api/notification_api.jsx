import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BASE_URL = 'https://api.shl-hr.com';

class NotificationAPI {
  constructor() {
    this.stompClient = null;
    this.currentReceiverCode = null;
    this.subscribers = new Set();
    this.displayedNotificationIds = new Set();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.subscriptionId = null;
    this._connectTimeoutId = null;
  }

  // Connect to WebSocket with improved error handling
  connect(receiverCode) {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous connection attempts
      if (this.isConnecting) {
        console.log('[WebSocket] Connection already in progress');
        const start = Date.now();
        const wait = setInterval(() => {
          if (!this.isConnecting) {
            clearInterval(wait);
            return resolve(this.stompClient?.connected || false);
          }
          if (Date.now() - start > 10000) {
            clearInterval(wait);
            return resolve(false);
          }
        }, 200);
        return;
      }

      // If already connected to the same receiver, just resolve
      if (this.stompClient?.connected && this.currentReceiverCode === receiverCode) {
        console.log('[WebSocket] Already connected to receiver:', receiverCode);
        return resolve(true);
      }

      // Disconnect if connected to different receiver
      if (this.stompClient?.connected && this.currentReceiverCode !== receiverCode) {
        console.log('[WebSocket] Disconnecting from previous receiver');
        this.disconnect(true);
      }

      this.isConnecting = true;
      this.currentReceiverCode = receiverCode;
      console.log(`[WebSocket] 🔌 Connecting to receiver code: ${receiverCode}`);

      // Construct WebSocket URL
      const wsUrl = `${BASE_URL}/ws`;
      console.log('[WebSocket] Connecting to:', wsUrl);

      const token = localStorage.getItem('token');
      const headers = {
        'ngrok-skip-browser-warning': 'true'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: headers,
        debug: (str) => {
          // Only log important messages
          if (str.includes('ERROR') || str.includes('CONNECTED') || str.includes('MESSAGE') || str.includes('DISCONNECT')) {
            console.log('[WebSocket Debug]:', str);
          }
        },
        reconnectDelay: 0,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: (frame) => this.onConnectHandler(frame, resolve),
        onStompError: (frame) => this.onErrorHandler(frame, resolve, reject),
        onWebSocketError: (error) => this.onWebSocketErrorHandler(error, resolve, reject),
        onDisconnect: () => this.onDisconnectHandler(),
        onWebSocketClose: () => {
          console.log('[WebSocket] 🔌 WebSocket closed');
          this.handleReconnect();
        }
      });

      try {
        // Activate the client
        // Ensure any prior timeout is cleared
        if (this._connectTimeoutId) {
          clearTimeout(this._connectTimeoutId);
          this._connectTimeoutId = null;
        }
        // Add a timeout so initial await does not hang forever
        this._connectTimeoutId = setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false;
            resolve(false);
          }
        }, 5000);

        this.stompClient.activate();
      } catch (error) {
        console.error('[WebSocket] ❌ Activation error:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Connection success handler
  onConnectHandler(frame, resolve) {
    console.log('[WebSocket] ✅ Connected successfully');
    console.log('[WebSocket] Frame:', frame);
    this.isConnecting = false;
    this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    if (this._connectTimeoutId) {
      clearTimeout(this._connectTimeoutId);
      this._connectTimeoutId = null;
    }

    try {
      // Subscribe to notifications topic
      const topicPath = `/topic/notifications/${this.currentReceiverCode}`;
      console.log('[WebSocket] 📡 Subscribing to topic:', topicPath);

      const subscription = this.stompClient.subscribe(
        topicPath,
        (message) => this.handleIncomingMessage(message),
        {
          // Additional subscription headers if needed
          id: `sub-${this.currentReceiverCode}-${Date.now()}`
        }
      );

      this.subscriptionId = subscription.id;
      console.log('[WebSocket] 📡 Subscription ID:', this.subscriptionId);
      console.log('[WebSocket] 📊 Current subscribers count:', this.subscribers.size);

      resolve(true);
    } catch (error) {
      console.error('[WebSocket] ❌ Subscription error:', error);
      resolve(false);
    }
  }

  // Handle incoming WebSocket messages
  handleIncomingMessage(message) {
    console.log('[WebSocket] 📩 Raw message received:', message.body);
    console.log('[WebSocket] 📊 Active subscribers:', this.subscribers.size);

    try {
      const notification = JSON.parse(message.body);
      console.log('[WebSocket] 🔔 Parsed notification:', notification);

      // Validate notification structure
      if (!notification.id) {
        console.error('[WebSocket] ❌ Invalid notification: missing ID');
        return;
      }

      // Prevent duplicates
      if (this.displayedNotificationIds.has(notification.id)) {
        console.log('[WebSocket] ⏭️ Duplicate notification ignored:', notification.id);
        return;
      }

      this.displayedNotificationIds.add(notification.id);
      console.log('[WebSocket] 🆕 New notification, notifying subscribers NOW');

      // Immediately notify all subscribers
      this.notifySubscribers(notification);
    } catch (error) {
      console.error('[WebSocket] ❌ Failed to parse notification:', error);
      console.error('[WebSocket] Raw message body:', message.body);
    }
  }

  // Error handlers
  onErrorHandler(frame, resolve, reject) {
    console.error('[WebSocket] ❌ STOMP error:', frame);
    console.error('[WebSocket] Error headers:', frame.headers);
    console.error('[WebSocket] Error body:', frame.body);
    this.isConnecting = false;
    if (this._connectTimeoutId) {
      clearTimeout(this._connectTimeoutId);
      this._connectTimeoutId = null;
    }
    this.handleReconnect();
    if (typeof resolve === 'function') {
      resolve(false);
    }
  }

  onWebSocketErrorHandler(error, resolve, reject) {
    console.error('[WebSocket] ❌ WebSocket error:', error);
    this.isConnecting = false;
    if (this._connectTimeoutId) {
      clearTimeout(this._connectTimeoutId);
      this._connectTimeoutId = null;
    }
    this.handleReconnect();
    if (typeof resolve === 'function') {
      resolve(false);
    }
  }

  onDisconnectHandler() {
    console.log('[WebSocket] 🔌 Disconnected');
    this.isConnecting = false;
    this.subscriptionId = null;
  }

  // Handle reconnection logic
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] ❌ Max reconnection attempts reached');
      return;
    }

    if (!this.currentReceiverCode) {
      console.log('[WebSocket] No receiver code set, skipping reconnect');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`[WebSocket] 🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.currentReceiverCode && !this.stompClient?.connected) {
        console.log('[WebSocket] 🔄 Reconnecting...');
        this.connect(this.currentReceiverCode).catch(error => {
          console.error('[WebSocket] Reconnection failed:', error);
        });
      }
    }, delay);
  }

  // Disconnect from WebSocket
  disconnect(force = false) {
    if (!this.stompClient) {
      return;
    }

    // Only disconnect if forced or there are no active subscribers
    if (!force && this.subscribers.size > 0) {
      console.log('[WebSocket] 🛑 Not disconnecting: active subscribers present =', this.subscribers.size);
      return;
    }

    try {
      if (this.stompClient.connected) {
        this.stompClient.deactivate();
        console.log('[WebSocket] 🔌 Disconnected successfully');
      }
    } catch (error) {
      console.error('[WebSocket] Error during disconnect:', error);
    }

    this.stompClient = null;
    this.currentReceiverCode = null;
    this.isConnecting = false;
    this.subscriptionId = null;
    this.reconnectAttempts = 0;
  }

  // Subscribe to notifications
  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.error('[WebSocket] ❌ Subscribe requires a function callback');
      return () => {};
    }

    console.log('[WebSocket] 📝 New subscriber added. Total subscribers:', this.subscribers.size + 1);
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      console.log('[WebSocket] 📝 Subscriber removed. Remaining subscribers:', this.subscribers.size - 1);
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(notification) {
    console.log(`[WebSocket] 📢 NOTIFYING ${this.subscribers.size} SUBSCRIBERS`);
    console.log('[WebSocket] Notification data:', notification);

    if (this.subscribers.size === 0) {
      console.warn('[WebSocket] ⚠️ No subscribers to notify!');
      return;
    }

    let successCount = 0;
    const subscribersArray = Array.from(this.subscribers);

    subscribersArray.forEach((callback, index) => {
      try {
        console.log(`[WebSocket] 📤 Calling subscriber #${index + 1}`);
        
        // Call callback synchronously (no setTimeout)
        callback(notification);
        
        successCount++;
        console.log(`[WebSocket] ✅ Subscriber #${index + 1} notified successfully`);
      } catch (error) {
        console.error(`[WebSocket] ❌ Subscriber #${index + 1} callback error:`, error);
        console.error('[WebSocket] Error stack:', error.stack);
      }
    });

    console.log(`[WebSocket] 📊 Successfully notified ${successCount}/${this.subscribers.size} subscribers`);
  }

  // Fetch notifications via REST API
  async fetchNotifications(receiverCode) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log(`[REST] 📥 Fetching notifications for receiver code: ${receiverCode}`);

      const response = await fetch(
        `${BASE_URL}/api/notifications/${receiverCode}`,
        {
          method: 'GET',
          headers
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('[REST] ❌ Server returned non-JSON response');
        return [];
      }

      const notifications = await response.json();

      console.log(`[REST] ✅ Loaded ${notifications.length} notifications`);

      // Track displayed notifications to prevent duplicates
      notifications.forEach(notification => {
        if (notification.id) {
          this.displayedNotificationIds.add(notification.id);
        }
      });

      return notifications;
    } catch (error) {
      console.error('[REST] ❌ Failed to fetch notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(receiverCode, notificationId) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/notifications/${receiverCode}/read/${notificationId}`,
        {
          method: 'POST',
          headers
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`[REST] ✅ Marked notification ${notificationId} as read`);
      return { success: true };
    } catch (error) {
      console.error('[REST] ❌ Failed to mark as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(receiverCode) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/notifications/${receiverCode}/read-all`,
        {
          method: 'POST',
          headers
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('[REST] ✅ Marked all notifications as read');
      return { success: true };
    } catch (error) {
      console.error('[REST] ❌ Failed to mark all as read:', error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(receiverCode, notificationId) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/notifications/${receiverCode}/clear/${notificationId}`,
        {
          method: 'POST',
          headers
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.displayedNotificationIds.delete(notificationId);
      console.log(`[REST] ✅ Deleted notification ${notificationId}`);
      return { success: true };
    } catch (error) {
      console.error('[REST] ❌ Failed to delete notification:', error);
      throw error;
    }
  }

  // Clear all notifications
  async clearAllNotifications(receiverCode) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/api/notifications/${receiverCode}/clear-all`,
        {
          method: 'POST',
          headers
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.displayedNotificationIds.clear();
      console.log('[REST] ✅ Cleared all notifications');
      return { success: true };
    } catch (error) {
      console.error('[REST] ❌ Failed to clear all notifications:', error);
      throw error;
    }
  }

  // Get connection status
  isConnected() {
    return this.stompClient?.connected || false;
  }

  // Get current connection state
  getConnectionState() {
    if (!this.stompClient) return 'disconnected';
    if (this.isConnecting) return 'connecting';
    if (this.stompClient.connected) return 'connected';
    return 'disconnected';
  }

  // Force reconnection
  forceReconnect() {
    console.log('[WebSocket] 🔄 Force reconnecting...');
    this.reconnectAttempts = 0;
    if (this.currentReceiverCode) {
      this.disconnect(true);
      return this.connect(this.currentReceiverCode);
    }
    return Promise.resolve(false);
  }
}

// Export singleton instance
export const notificationAPI = new NotificationAPI();