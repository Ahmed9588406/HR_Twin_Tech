import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// Mock API service - Replace with your actual API calls
const notificationAPI = {
  async fetchNotifications() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - replace with actual API call
    return [
      {
        id: 1,
        type: 'success',
        title: 'Leave Request Approved',
        message: 'Your leave request for Dec 20-22 has been approved.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        read: false,
        actionUrl: '/requests/123'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Timesheet Reminder',
        message: 'Please submit your timesheet for this week.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
        actionUrl: '/timesheets'
      },
      {
        id: 3,
        type: 'info',
        title: 'New Document Shared',
        message: 'HR Policy 2024 has been shared with you.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
        actionUrl: '/documents/456'
      },
      {
        id: 4,
        type: 'alert',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Saturday 10 PM - 2 AM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true,
        actionUrl: null
      }
    ];
  },
  
  async markAsRead(notificationId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },
  
  async markAllAsRead() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },
  
  async deleteNotification(notificationId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
};

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
const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }) => {
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
        <NotificationIcon type={notification.type} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-semibold text-gray-900 ${
              !notification.read ? 'font-bold' : ''
            }`}>
              {notification.title}
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
export const NotificationModal = ({ isOpen, onClose, buttonRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const modalRef = useRef(null);
  
  // Draggable state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 80 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragHandleRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      // Reset position when modal opens
      setPosition({ x: window.innerWidth - 420, y: 80 });
    }
  }, [isOpen]);
  
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
        
        // Constrain to viewport
        const maxX = window.innerWidth - 384; // 384px = w-96
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
  
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationAPI.fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };
  
  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };
  
  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      // Navigate to the action URL
      console.log('Navigate to:', notification.actionUrl);
      // window.location.href = notification.actionUrl; // or use your router
    }
  };
  
  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;
  
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
            {unreadCount > 0 && (
              <span className="bg-white text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
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
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-green-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-white text-green-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'unread' ? "You're all caught up!" : 'Check back later for updates'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>
      
      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="w-full py-2 text-sm font-medium text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-4 h-4 inline mr-1" />
            Mark all as read
          </button>
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
