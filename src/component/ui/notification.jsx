import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { notificationAPI } from './api/notification_api';

// Utility function to format timestamps
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now - notificationDate) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return notificationDate.toLocaleDateString('en-US', { 
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
              aria-label="Delete notification"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          {notification.sender && (
            <div className="text-xs text-gray-500 mb-1">
              From: {notification.sender.name} (Code: {notification.sender.code})
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

// Main Notification Modal Component
export const NotificationModal = ({ isOpen, onClose, buttonRef, receiverCode }) => {
  // If receiverCode is not provided, get it from localStorage (empcode from login)
  const empCode = receiverCode || localStorage.getItem('code') || '7';
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const modalRef = useRef(null);
  
  // Draggable state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 80 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragHandleRef = useRef(null);
  
  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwF');
    audio.play().catch(() => {});
  };
  
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      connectWebSocket();
      setPosition({ x: window.innerWidth - 420, y: 80 });
    } else {
      // Optionally disconnect when modal closes
      // notificationAPI.disconnect();
    }
    
    return () => {
      // Cleanup on unmount
      notificationAPI.disconnect();
    };
  }, [isOpen, empCode]); // Add empCode to dependency array for re-connection if code changes
  
  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = notificationAPI.subscribe((notification) => {
      setNotifications(prev => {
        // Check if notification already exists
        if (prev.some(n => n.id === notification.id)) {
          return prev;
        }
        playNotificationSound();
        return [notification, ...prev];
      });
    });
    
    return unsubscribe;
  }, []);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
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
      await notificationAPI.connect(empCode); // Use empCode instead of receiverCode
      setConnectionStatus('connected');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setConnectionStatus('disconnected');
    }
  };
  
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationAPI.fetchNotifications(empCode); // Use empCode instead of receiverCode
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(empCode, notificationId); // Use empCode
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(empCode); // Use empCode
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };
  
  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(empCode, notificationId); // Use empCode
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };
  
  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      console.log('Navigate to:', notification.actionUrl);
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
      await Promise.all(idsToDelete.map(id => notificationAPI.deleteNotification(empCode, id))); // Use empCode
      setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to delete selected notifications:', error);
    }
  };
  
  const filteredNotifications = notifications;
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={modalRef}
      className="fixed w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[90] overflow-hidden transition-shadow duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
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
            <h3 className="font-bold text-lg">Notifications</h3>
            {connectionStatus === 'connected' && (
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" title="Live"></span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close notifications"
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
            {selectedNotifications.size === notifications.length ? 'Deselect All' : 'Select All'}
          </button>
          {selectedNotifications.size > 0 && (
            <span className="text-sm text-white/80">
              {selectedNotifications.size} selected
            </span>
          )}
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
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
            Mark all as read
          </button>
          {selectedNotifications.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-300 rounded-lg"
            >
              Delete Selected ({selectedNotifications.size})
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
      `}</style>
    </div>
  );
};
