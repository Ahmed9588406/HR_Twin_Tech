import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev';

class NotificationAPI {
  constructor() {
    this.stompClient = null;
    this.currentReceiverCode = null;
    this.subscribers = new Set();
    this.displayedNotificationIds = new Set();
  }

  // Connect to WebSocket
  connect(receiverCode) {
    return new Promise((resolve, reject) => {
      if (this.stompClient && this.stompClient.connected) {
        this.disconnect();
      }

      this.currentReceiverCode = receiverCode;
      console.log(`[WebSocket] Connecting with receiver code: ${receiverCode}`);

      // Use proper Client initialization instead of Stomp.over
      this.stompClient = new Client({
        brokerURL: `${BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/ws`,
        connectHeaders: {},
        debug: (str) => {
          // Disable debug in production
          // console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // Use SockJS as fallback
        webSocketFactory: () => {
          return new SockJS(`${BASE_URL}/ws`);
        }
      });

      this.stompClient.onConnect = () => {
        console.log('[WebSocket] Connected successfully');
        
        // Subscribe to notifications topic
        this.stompClient.subscribe(
          `/topic/notifications/${receiverCode}`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              
              // Prevent duplicates
              if (!this.displayedNotificationIds.has(notification.id)) {
                this.displayedNotificationIds.add(notification.id);
                this.notifySubscribers(notification);
              }
            } catch (error) {
              console.error('[WebSocket] Failed to parse notification:', error);
            }
          }
        );

        resolve(true);
      };

      this.stompClient.onStompError = (frame) => {
        console.error('[WebSocket] STOMP error:', frame);
        reject(new Error('WebSocket connection failed'));
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error('[WebSocket] Connection error:', error);
        reject(error);
      };

      this.stompClient.activate();
    });
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.currentReceiverCode = null;
      console.log('[WebSocket] Disconnected');
    }
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers
  notifySubscribers(notification) {
    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('[WebSocket] Subscriber callback error:', error);
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
        `${BASE_URL}/api/notifications/2`,
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
