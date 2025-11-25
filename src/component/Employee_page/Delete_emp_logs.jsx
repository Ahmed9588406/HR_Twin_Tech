import React, { useState, useEffect, useRef } from 'react';
import { UserMinus, X, Calendar, Clock } from 'lucide-react';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

const TEXT = {
  en: {
    employeeLogs: 'Employee Logs',
    close: 'Close modal',
    noLogs: 'No logs available.',
    delete: 'Delete',
    discount: 'Discount:',
    reward: 'Reward:',
    attendanceSalary: 'Attendance Salary:',
    totalSalary: 'Total Salary:'
  },
  ar: {
    employeeLogs: 'سجلات الموظفين',
    close: 'إغلاق النافذة',
    noLogs: 'لا توجد سجلات متاحة.',
    delete: 'حذف',
    discount: 'الخصم:',
    reward: 'المكافأة:',
    attendanceSalary: 'راتب الحضور:',
    totalSalary: 'إجمالي الراتب:'
  }
};

const DeleteEmployeeModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  
  // Draggable state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragHandleRef = useRef(null);

  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  useEffect(() => {
    if (isOpen) {
      // Reset position when modal opens
      setPosition({ x: window.innerWidth / 2 - 200, y: 100 });
      fetchLogs();
    }
  }, [isOpen]);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  // Drag handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - 400; // Approximate modal width
        const maxY = window.innerHeight - 200;
        
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
  
  const formatTime12Hour = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Auth token not found; please log in again.');
      }

      const response = await fetch('https://api.shl-hr.com/api/v1/employees/logs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch logs: ${response.status} - ${text}`);
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={modalRef}
      className="fixed w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
      dir={dir}
      lang={lang}
    >
      {/* Header */}
      <div 
        ref={dragHandleRef}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserMinus className="w-5 h-5" />
            <h3 className="font-bold text-lg">{copy.employeeLogs}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={copy.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-center">{copy.noLogs}</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{log.empName}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    log.action === 'Delete' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {log.action === 'Delete' ? copy.delete : log.action}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{log.details}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{log.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime12Hour(log.time)}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <p>{copy.discount} {log.discount.toFixed(2)}</p>
                  <p>{copy.reward} {log.reward.toFixed(2)}</p>
                  <p>{copy.attendanceSalary} {log.attendanceSalary.toFixed(2)}</p>
                  <p>{copy.totalSalary} {log.totalSalary.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteEmployeeModal;
