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
        return resolve(true);
      }

      // Disconnect if connected to different receiver
      if (this.stompClient?.connected && this.currentReceiverCode !== receiverCode) {
        this.disconnect(true);
      }

      this.isConnecting = true;
      this.currentReceiverCode = receiverCode;
      // Construct WebSocket URL
      const wsUrl = `${BASE_URL}/ws`;
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
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Connection success handler
  onConnectHandler(frame, resolve) {
    this.isConnecting = false;
    this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    if (this._connectTimeoutId) {
      clearTimeout(this._connectTimeoutId);
      this._connectTimeoutId = null;
    }

    try {
      // Subscribe to notifications topic
      const topicPath = `/topic/notifications/${this.currentReceiverCode}`;
      const subscription = this.stompClient.subscribe(
        topicPath,
        (message) => this.handleIncomingMessage(message),
        {
          // Additional subscription headers if needed
          id: `sub-${this.currentReceiverCode}-${Date.now()}`
        }
      );

      this.subscriptionId = subscription.id;
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  }

  // Handle incoming WebSocket messages
  handleIncomingMessage(message) {
    try {
      const notification = JSON.parse(message.body);
      // Validate notification structure
      if (!notification.id) {
        return;
      }

      // Prevent duplicates
      if (this.displayedNotificationIds.has(notification.id)) {
        return;
      }

      this.displayedNotificationIds.add(notification.id);
      // Immediately notify all subscribers
      this.notifySubscribers(notification);
    } catch (error) {
      }
  }

  // Error handlers
  onErrorHandler(frame, resolve, reject) {
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
    this.isConnecting = false;
    this.subscriptionId = null;
  }

  // Handle reconnection logic
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    if (!this.currentReceiverCode) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    setTimeout(() => {
      if (this.currentReceiverCode && !this.stompClient?.connected) {
        this.connect(this.currentReceiverCode).catch(error => {
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
      return;
    }

    try {
      if (this.stompClient.connected) {
        this.stompClient.deactivate();
        }
    } catch (error) {
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
      return () => {};
    }

    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(notification) {
    if (this.subscribers.size === 0) {
      return;
    }

    let successCount = 0;
    const subscribersArray = Array.from(this.subscribers);

    subscribersArray.forEach((callback, index) => {
      try {
        // Call callback synchronously (no setTimeout)
        callback(notification);
        
        successCount++;
        } catch (error) {
        }
    });

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
        return [];
      }

      const notifications = await response.json();

      // Track displayed notifications to prevent duplicates
      notifications.forEach(notification => {
        if (notification.id) {
          this.displayedNotificationIds.add(notification.id);
        }
      });

      return notifications;
    } catch (error) {
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

      return { success: true };
    } catch (error) {
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

      return { success: true };
    } catch (error) {
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
      return { success: true };
    } catch (error) {
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
      return { success: true };
    } catch (error) {
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