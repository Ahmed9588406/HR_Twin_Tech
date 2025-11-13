import React from "react";

/**
 * Modern Employee Card Component
 * 
 * Props:
 *  - employee (object) - { name, role, department, avatar, status, checkInTime }
 *  - onClick (function) - optional click handler
 */
export default function EmployeeCard({ 
  employee,
  onClick 
}) {
  // Dummy data for demonstration
  const defaultEmployee = {
    name: "Abdulrahman Ahmed",
    role: "Backend Developer",
    department: "Programming",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "Stay here", // "Stay here", "Checked out", "On break", "In meeting"
    checkInTime: "10:01"
  };

  const emp = employee || defaultEmployee;

  // Status configurations
  const statusConfig = {
    "Stay here": {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      dotColor: "bg-emerald-500",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    "Checked out": {
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      dotColor: "bg-gray-400",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    },
    "On break": {
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      dotColor: "bg-amber-500",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      )
    },
    "In meeting": {
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-500",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  };

  const currentStatus = statusConfig[emp.status] || statusConfig["Stay here"];

  return (
    <div 
      onClick={onClick}
      className={`
        group relative bg-white border border-gray-200 rounded-2xl p-4 
        shadow-sm hover:shadow-lg transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-emerald-300' : ''}
        overflow-hidden
      `}
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50/50 to-transparent rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-3">
        {/* Avatar with status indicator */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all duration-300 overflow-hidden">
            <img 
              src={emp.avatar} 
              alt={emp.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          {/* Status dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${currentStatus.dotColor} animate-pulse`} />
          </div>
        </div>

        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors duration-200">
            {emp.name}
          </h3>
          <p className="text-xs text-gray-600 truncate font-medium">
            {emp.role}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {emp.department}
          </p>
        </div>

        {/* Status & Time */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {/* Status badge */}
          <div className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-lg
            ${currentStatus.bgColor} ${currentStatus.color}
            transition-all duration-200
          `}>
            {currentStatus.icon}
            <span className="text-xs font-medium whitespace-nowrap">
              {emp.status}
            </span>
          </div>

          {/* Check-in time */}
          <div className="flex items-center gap-1 text-emerald-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-xs font-semibold">
              {emp.checkInTime}
            </span>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-200/50 transition-all duration-300 pointer-events-none" />
    </div>
  );
}