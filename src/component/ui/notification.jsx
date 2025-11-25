import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Check, Trash2, Clock, FileText, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { notificationAPI } from './api/notification_api';
import { showBrowserNotification } from '../../firebase_config';
import { t as _t, getLang as _getLang } from '../../i18n/i18n';

// Utility function to format timestamps
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now - notificationDate) / 1000);
  
  if (diffInSeconds < 60) return _t('JUST_NOW');
  if (diffInSeconds < 3600) return _t('AGO_MINUTES', { n: Math.floor(diffInSeconds / 60) });
  if (diffInSeconds < 86400) return _t('AGO_HOURS', { n: Math.floor(diffInSeconds / 3600) });
  if (diffInSeconds < 604800) return _t('AGO_DAYS', { n: Math.floor(diffInSeconds / 86400) });
  
  const locale = _getLang() === 'ar' ? 'ar' : 'en-US';
  return notificationDate.toLocaleDateString(locale, { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Notification Icon Component
const NotificationIcon = ({ type }) => {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <FileText className="w-5 h-5" />,
    alert: <AlertCircle className="w-5 h-5" />
  };
  
  const colorMap = {
    success: 'text-green-500 bg-green-50',
    warning: 'text-amber-500 bg-amber-50',
    info: 'text-blue-500 bg-blue-50',
    alert: 'text-red-500 bg-red-50'
  };
  
  return (
    <div className={`p-2 rounded-lg ${colorMap[type] || colorMap.info}`}>
      {iconMap[type] || iconMap.info}
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick, isSelected, onToggleSelect }) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };
  
  return (
    <div
      className={`group p-4 border-b border-gray-100 transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
        !notification.read ? 'bg-blue-50/30' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(notification.id);
          }}
          className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          onClick={(e) => e.stopPropagation()}
        />
        <NotificationIcon type={notification.type} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-semibold text-gray-900 ${
              !notification.read ? 'font-bold' : ''
            }`}>
              {notification.title || notification.message}
              {!notification.read && (
                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-200"
              aria-label={_t('DELETE_NOTIFICATION')}
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          {notification.sender && (
            <div className="text-xs text-gray-500 mb-1">
              {_t('FROM')}: {notification.sender.name} ({_t('CODE')}: {notification.sender.code})
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTimestamp(notification.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Notification Component
const ToastNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-[100] animate-slideInRight">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <NotificationIcon type={notification.type} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {notification.title || _t('NEW_NOTIFICATION')}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {notification.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Play notification sound
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Second beep
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 1000;
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.3);
    }, 150);
  } catch (error) {
    }
};

// Main Notification Modal Component
export const NotificationModal = ({ isOpen, onClose, buttonRef, receiverCode, onUnreadCountChange }) => {
  const empCode = receiverCode || localStorage.getItem('code') || '7';
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [toastNotification, setToastNotification] = useState(null);
  const modalRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isModalOpenRef = useRef(isOpen);
  
  // Draggable state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 80 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragHandleRef = useRef(null);
  
  // Update ref when modal state changes
  useEffect(() => {
    isModalOpenRef.current = isOpen;
  }, [isOpen]);

  // Calculate and report total notification count whenever notifications change
  useEffect(() => {
    const totalCount = notifications.length;
    if (onUnreadCountChange) {
      onUnreadCountChange(totalCount);
    }
  }, [notifications, onUnreadCountChange]);
  
  // Handle new notification callback
  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) {
        return prev;
      }
      
      return [notification, ...prev];
    });
    
    // Play notification sound
    playNotificationSound();
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      showBrowserNotification(notification.title || _t('NEW_NOTIFICATION'), {
        body: notification.message || _t('YOU_HAVE_NEW_NOTIFICATION'),
        icon: '/notification-icon.png',
        tag: notification.id?.toString(),
        requireInteraction: false
      });
    }
    
    // Show toast notification only if modal is closed
    if (!isModalOpenRef.current) {
      setToastNotification(notification);
    }
  }, []);
  
  // Initialize WebSocket connection on mount
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        setConnectionStatus('connecting');
        
        // Connect to WebSocket
        const connected = await notificationAPI.connect(empCode);
        
        if (connected) {
          setConnectionStatus('connected');
          } else {
          setConnectionStatus('disconnected');
          }
        
        // Load initial notifications
        setLoading(true);
        const data = await notificationAPI.fetchNotifications(empCode);
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        setConnectionStatus('disconnected');
        setLoading(false);
        
        // Retry connection after 5 seconds
        setTimeout(initializeConnection, 5000);
      }
    };

    initializeConnection();
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
      // Don't disconnect on unmount to keep connection alive
    };
  }, [empCode]);
  
  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = notificationAPI.subscribe(handleNewNotification);
    subscriptionRef.current = unsubscribe;
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [handleNewNotification]);
  
  // Monitor connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const state = notificationAPI.getConnectionState();
      setConnectionStatus(state);
    }, 2000);
    
    return () => clearInterval(checkConnection);
  }, []);
  
  // Load notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      const refreshNotifications = async () => {
        const data = await notificationAPI.fetchNotifications(empCode);
        setNotifications(data);
        };
      refreshNotifications();
      setPosition({ x: window.innerWidth - 420, y: 80 });
    }
  }, [isOpen, empCode]);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, buttonRef]);
  
  // Drag handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        const maxX = window.innerWidth - 384;
        const maxY = window.innerHeight - 100;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);
  
  const handleMouseDown = (e) => {
    if (dragHandleRef.current && dragHandleRef.current.contains(e.target)) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  const connectWebSocket = async () => {
    try {
      setConnectionStatus('connecting');
      await notificationAPI.forceReconnect();
      setConnectionStatus('connected');
      } catch (error) {
      setConnectionStatus('disconnected');
    }
  };
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(empCode, notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(empCode);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      }
  };
  
  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(empCode, notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    } catch (error) {
      }
  };
  
  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      // window.location.href = notification.actionUrl;
    }
  };
  
  const handleToggleSelect = (id) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const handleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedNotifications.size === 0) return;
    
    const idsToDelete = Array.from(selectedNotifications);
    
    try {
      await Promise.all(idsToDelete.map(id => notificationAPI.deleteNotification(empCode, id)));
      setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
      setSelectedNotifications(new Set());
    } catch (error) {
      }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (!isOpen) {
    return (
      <>
        {toastNotification && (
          <ToastNotification
            notification={toastNotification}
            onClose={() => setToastNotification(null)}
          />
        )}
      </>
    );
  }
  
  return (
    <>
      {toastNotification && (
        <ToastNotification
          notification={toastNotification}
          onClose={() => setToastNotification(null)}
        />
      )}
      
      <div
        ref={modalRef}
        className="fixed w-full sm:w-96 max-w-full sm:max-w-96 bg-white rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-gray-200 z-[90] overflow-hidden transition-shadow duration-200"
        style={{
          left: window.innerWidth < 640 ? '0' : `${position.x}px`,
          top: window.innerWidth < 640 ? '0' : `${position.y}px`,
          right: window.innerWidth < 640 ? '0' : 'auto',
          bottom: window.innerWidth < 640 ? '0' : 'auto',
          height: window.innerWidth < 640 ? '100vh' : 'auto',
          cursor: isDragging ? 'grabbing' : 'default',
          animation: 'slideDown 0.2s ease-out'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div 
          ref={dragHandleRef}
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold text-lg">{_t('NOTIFICATIONS')}</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                  {unreadCount}
                </span>
              )}
              {connectionStatus === 'connected' && (
                <Wifi className="w-4 h-4 animate-pulse" title={_t('LIVE_CONNECTED')} />
              )}
              {connectionStatus === 'connecting' && (
                <span className="text-xs bg-yellow-500 px-2 py-1 rounded" title={_t('CONNECTING')}>
                  {_t('CONNECTING')}
                </span>
              )}
              {connectionStatus === 'disconnected' && (
                <button
                  onClick={connectWebSocket}
                  className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded flex items-center gap-1"
                  title={_t('CLICK_TO_RECONNECT')}
                >
                  <WifiOff className="w-3 h-3" />
                  {_t('RECONNECT')}
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label={_t('CLOSE_NOTIFICATIONS')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Select All Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              {selectedNotifications.size === notifications.length ? _t('DESELECT_ALL') : _t('SELECT_ALL')}
            </button>
            {selectedNotifications.size > 0 && (
              <span className="text-sm text-white/80">
                {selectedNotifications.size} {_t('SELECTED_COUNT', { n: selectedNotifications.size })}
              </span>
            )}
          </div>
        </div>
        
        {/* Notifications List */}
        <div className="max-h-96 sm:max-h-96 overflow-y-auto" style={{ maxHeight: window.innerWidth < 640 ? 'calc(100vh - 200px)' : '24rem' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{_t('NO_NOTIFICATIONS')}</p>
              <p className="text-sm text-gray-400 mt-1">{_t('CHECK_BACK')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
                isSelected={selectedNotifications.has(notification.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))
          )}
        </div>
        
        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-3 bg-gray-50 flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex-1 py-2 text-sm font-medium text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-4 h-4 inline mr-1" />
              {_t('MARK_ALL_AS_READ')}
            </button>
            {selectedNotifications.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-300 rounded-lg"
              >
                {_t('DELETE_BTN')} ({selectedNotifications.size})
              </button>
            )}
          </div>
        )}
        
        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};