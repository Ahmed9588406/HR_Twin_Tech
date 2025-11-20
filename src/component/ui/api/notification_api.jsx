import { Client } from '@stomp/stompjs';

const BASE_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev';

class NotificationAPI {
  constructor() {
    this.stompClient = null;
    this.currentReceiverCode = null;
    this.subscribers = new Set();
    this.displayedNotificationIds = new Set();
    this.isConnecting = false;
  }

  // Connect to WebSocket
  connect(receiverCode) {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous connection attempts
      if (this.isConnecting) {
        console.log('[WebSocket] Connection already in progress');
        return resolve(false);
      }

      // If already connected to the same receiver, just resolve
      if (this.stompClient && this.stompClient.connected && this.currentReceiverCode === receiverCode) {
        console.log('[WebSocket] Already connected to receiver:', receiverCode);
        return resolve(true);
      }

      // Disconnect if connected to different receiver
      if (this.stompClient && this.stompClient.connected) {
        console.log('[WebSocket] Disconnecting from previous receiver');
        this.disconnect(true);
      }

      this.isConnecting = true;
      this.currentReceiverCode = receiverCode;
      console.log(`[WebSocket] 🔌 Connecting to receiver code: ${receiverCode}`);

      this.stompClient = new Client({
        // Use native WebSocket instead of SockJS
        brokerURL: `${BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/ws`,
        connectHeaders: {
          'ngrok-skip-browser-warning': 'true'
        },
        debug: (str) => {
          if (str.includes('ERROR') || str.includes('CONNECTED') || str.includes('MESSAGE')) {
            console.log('[WebSocket Debug]:', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        // Remove webSocketFactory to use native WebSocket
      });

      this.stompClient.onConnect = (frame) => {
        console.log('[WebSocket] ✅ Connected successfully to receiver:', receiverCode);
        console.log('[WebSocket] 📊 Current subscribers count:', this.subscribers.size);
        this.isConnecting = false;
        
        // Subscribe to notifications topic
        const subscription = this.stompClient.subscribe(
          `/topic/notifications/${receiverCode}`,
          (message) => {
            console.log('[WebSocket] 📩 Raw message received:', message.body);
            console.log('[WebSocket] 📊 Will notify', this.subscribers.size, 'subscribers');
            
            try {
              const notification = JSON.parse(message.body);
              console.log('[WebSocket] 🔔 Parsed notification:', notification);
              
              // Prevent duplicates
              if (!this.displayedNotificationIds.has(notification.id)) {
                this.displayedNotificationIds.add(notification.id);
                console.log('[WebSocket] 🆕 New notification, notifying subscribers NOW');
                
                // Immediately notify all subscribers
                this.notifySubscribers(notification);
              } else {
                console.log('[WebSocket] ⏭️ Duplicate notification ignored:', notification.id);
              }
            } catch (error) {
              console.error('[WebSocket] ❌ Failed to parse notification:', error);
            }
          }
        );

        console.log('[WebSocket] 📡 Subscribed to topic:', `/topic/notifications/${receiverCode}`);
        console.log('[WebSocket] 📡 Subscription ID:', subscription.id);
        resolve(true);
      };

      this.stompClient.onStompError = (frame) => {
        console.error('[WebSocket] ❌ STOMP error:', frame);
        this.isConnecting = false;
        reject(new Error('WebSocket STOMP error'));
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error('[WebSocket] ❌ Connection error:', error);
        this.isConnecting = false;
        reject(error);
      };

      this.stompClient.onDisconnect = () => {
        console.log('[WebSocket] 🔌 Disconnected');
        this.isConnecting = false;
      };

      // Activate the client
      this.stompClient.activate();
    });
  }

  // Disconnect from WebSocket
  disconnect(force = false) {
    if (!this.stompClient) {
      return;
    }

    // Only disconnect if forced or there are no active subscribers
    if (!force && this.subscribers && this.subscribers.size > 0) {
      console.log('[WebSocket] 🛑 Not disconnecting: active subscribers present =', this.subscribers.size);
      return;
    }

    try {
      this.stompClient.deactivate();
      console.log('[WebSocket] 🔌 Disconnected');
    } catch (error) {
      console.error('[WebSocket] Error during disconnect:', error);
    }
    this.stompClient = null;
    this.currentReceiverCode = null;
    this.isConnecting = false;
  }

  // Subscribe to notifications
  subscribe(callback) {
    console.log('[WebSocket] 📝 New subscriber added');
    this.subscribers.add(callback);
    return () => {
      console.log('[WebSocket] 📝 Subscriber removed');
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(notification) {
    console.log(`[WebSocket] 📢 NOTIFYING ${this.subscribers.size} SUBSCRIBERS WITH:`, notification);
    
    if (this.subscribers.size === 0) {
      console.warn('[WebSocket] ⚠️ No subscribers to notify!');
      return;
    }
    
    let successCount = 0;
    const subscribersArray = Array.from(this.subscribers);
    
    subscribersArray.forEach((callback, index) => {
      try {
        console.log(`[WebSocket] 📤 Calling subscriber #${index + 1} immediately`);
        
        // Call callback synchronously - DO NOT use setTimeout
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

      console.log(`[REST] Fetching notifications for receiver code: ${receiverCode}`);
      
      const response = await fetch(
        `${BASE_URL}/api/notifications/${receiverCode}`, // Use dynamic receiverCode instead of hardcoded '2'
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
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[REST] Server returned non-JSON response');
        return [];
      }

      const notifications = await response.json();
      
      console.log(`[REST] Loaded ${notifications.length} notifications for receiver code: ${receiverCode}`);
      
      // Track displayed notifications to prevent duplicates
      notifications.forEach(notification => {
        this.displayedNotificationIds.add(notification.id);
      });

      return notifications;
    } catch (error) {
      console.error('[REST] Failed to fetch notifications:', error);
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
      console.error('[REST] Failed to mark as read:', error);
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
      console.error('[REST] Failed to mark all as read:', error);
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
      console.error('[REST] Failed to delete notification:', error);
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
      console.error('[REST] Failed to clear all notifications:', error);
      throw error;
    }
  }

  // Get connection status
  isConnected() {
    return this.stompClient && this.stompClient.connected;
  }
}

// Export singleton instance
export const notificationAPI = new NotificationAPI();
