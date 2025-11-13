import React from "react";

/**
 * Modern Employee Card Component
 * 
 * Props:
 *  - employee (object) - { name, department, role, avatar, status }
 *  - onEdit (function) - edit button handler
 *  - onNotify (function) - notification/bell button handler
 *  - onDelete (function) - delete button handler
 *  - onLock (function) - lock/security button handler
 *  - onPhone (function) - phone button handler
 *  - onInfo (function) - info button handler
 */
export default function EmployeeCard({ 
  employee,
  onEdit,
  onNotify,
  onDelete,
  onLock,
  onPhone,
  onInfo
}) {
  // Dummy data for demonstration
  const defaultEmployee = {
    name: "Abdulrahman Ahmed",
    department: "Programming",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "Present" // "Present", "Absent", "On Leave", "Late"
  };

  const emp = employee || defaultEmployee;

  // Status configurations
  const statusConfig = {
    "Present": {
      color: "text-white",
      bgColor: "bg-gradient-to-r from-emerald-500 to-green-500",
      hoverColor: "hover:from-emerald-600 hover:to-green-600"
    },
    "Absent": {
      color: "text-white",
      bgColor: "bg-gradient-to-r from-red-500 to-rose-500",
      hoverColor: "hover:from-red-600 hover:to-rose-600"
    },
    "On Leave": {
      color: "text-white",
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      hoverColor: "hover:from-amber-600 hover:to-orange-600"
    },
    "Late": {
      color: "text-white",
      bgColor: "bg-gradient-to-r from-yellow-500 to-amber-500",
      hoverColor: "hover:from-yellow-600 hover:to-amber-600"
    }
  };

  const currentStatus = statusConfig[emp.status] || statusConfig["Present"];

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-50/40 to-transparent rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full ring-4 ring-gray-100 group-hover:ring-emerald-100 transition-all duration-300 overflow-hidden shadow-md">
            <img 
              src={emp.avatar} 
              alt={emp.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {/* Online status indicator */}
          {emp.status === "Present" && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-emerald-700 transition-colors duration-200">
            {emp.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium mb-0.5">
            {emp.department}
          </p>
          <p className="text-sm text-gray-400">
            {emp.role}
          </p>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-2">
        {/* Left Actions */}
        <div className="flex items-center gap-2">
          {/* Phone Button */}
          <button
            onClick={onPhone}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-emerald-100 text-gray-500 hover:text-emerald-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Call"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          {/* Info Button */}
          <button
            onClick={onInfo}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Information"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Status Badge - Center */}
        <div className="flex-1 flex justify-center">
          <button
            className={`
              px-6 py-2 rounded-xl font-semibold text-sm
              ${currentStatus.bgColor} ${currentStatus.color} ${currentStatus.hoverColor}
              shadow-md hover:shadow-lg transition-all duration-200
              hover:scale-105 active:scale-95
              min-w-[100px]
            `}
          >
            {emp.status}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          {/* Notification/Bell Button */}
          <button
            onClick={onNotify}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 relative"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Lock/Security Button */}
          <button
            onClick={onLock}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-amber-100 text-gray-500 hover:text-amber-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            title="Security"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-200/50 transition-all duration-300 pointer-events-none" />
    </div>
  );
}