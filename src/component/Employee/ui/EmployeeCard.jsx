import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CreateNewEmployee from "../../Employee_page/Create_new_Employee"; 
import { fetchEmployeeById } from "../../Settings/api/employees_api"; 
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../../i18n/i18n';

export default function EmployeeCard({ 
  employee,
  onClick,
  onEdit,
  onNotify,
  onDelete,
  onLock,
  onPhone,
  onInfo
}) {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [editEmployeeData, setEditEmployeeData] = useState(null); 
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  // Dummy data for demonstration
  const defaultEmployee = {
    name: "Abdulrahman Ahmed",
    department: "Programming",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "Stay here",
    checkInTime: "10:01"
  };

  const emp = employee || defaultEmployee;

  // Construct avatar URL from base64 data
  const getAvatarSrc = () => {
    if (emp.contentType && emp.image) {
      return `data:${emp.contentType};base64,${emp.image}`;
    }
    return emp.avatar || defaultEmployee.avatar;
  };

  const avatarSrc = getAvatarSrc();

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

  const handleEditClick = async () => {
    if (isEditModalOpen) {
      // If modal is already open, toggle it off
      setIsEditModalOpen(false);
      setEditEmployeeData(null);
    } else {
      // Fetch employee data and open the modal
      try {
        const data = await fetchEmployeeById(emp.id); // Fetch employee data by ID
        setEditEmployeeData(data); // Set the fetched data
        setIsEditModalOpen(true); // Open the modal
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false); // Close the modal
    setEditEmployeeData(null); // Clear the fetched data
  };

  // Helper to call action handlers without triggering card click
  const callHandler = (e, handler) => {
    e.stopPropagation();
    if (typeof handler === 'function') handler(emp);
  };

  return (
    <>
      <div 
        onClick={onClick}
        className="
          group relative bg-white border border-gray-200 rounded-2xl p-4 
          shadow-sm hover:shadow-lg transition-all duration-300
          cursor-pointer hover:border-emerald-300
          overflow-hidden
        "
      >
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50/50 to-transparent rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center gap-3">
          {/* Avatar with status indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all duration-300 overflow-hidden">
              <img 
                src={avatarSrc}
                alt={`${emp.name} image`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
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

          {/* Action icons row (new) */}
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-end gap-1 sm:gap-2">
            <button
              onClick={(e) => callHandler(e, onPhone)}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={_t('CALL')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-call w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true">
                <path d="M2.003 2.883a9.072 9.072 0 0 0 0 12.728l2.121-2.121a7.072 7.072 0 0 1 0-9.486L2.003 2.883z"></path>
                <path d="M22.004 2.883a9.072 9.072 0 0 1 0 12.728l-2.121-2.121a7.072 7.072 0 0 0 0-9.486l2.121-2.121z"></path>
                <path d="M12 22l-2-2m0 0l-2-2m4 4l2-2m0 0l2-2"></path>
              </svg>
            </button>

            <button
              onClick={(e) => callHandler(e, onNotify)}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={_t('NOTIFY')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0v4a6 6 0 0 0 12 0V8z"></path>
                <path d="M8 8V6a6 6 0 0 1 12 0v2"></path>
                <path d="M12 18v2a2 2 0 0 0 4 0v-2"></path>
                <path d="M8 18v2a2 2 0 0 1-4 0v-2"></path>
              </svg>
            </button>

            <button
              onClick={(e) => callHandler(e, onEdit)}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={_t('EDIT')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true">
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
              </svg>
            </button>

            <button
              onClick={(e) => callHandler(e, onInfo)}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={_t('SEND')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paper-plane w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true">
                <path d="M2.003 12.293l18.364-9.192a1 1 0 0 1 1.415.447l2.121 4.243a1 1 0 0 1-.447 1.415L13.414 12l10.121 5.707a1 1 0 0 1 .447 1.415l-2.121 4.243a1 1 0 0 1-1.415.447L2.003 12.293z"></path>
              </svg>
            </button>

            <button
              onClick={(e) => callHandler(e, onDelete)}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-red-50 rounded-lg transition-colors"
              title={_t('DELETE')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 w-4 h-4 sm:w-5 sm:h-5 text-red-600" aria-hidden="true">
                <path d="M3 6h18"></path>
                <path d="M9 6v12"></path>
                <path d="M15 6v12"></path>
                <path d="M4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6"></path>
              </svg>
            </button>

            <button
              onClick={(e) => callHandler(e, onLock)}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={_t('LOCK')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true">
                <path d="M17 8v4a5 5 0 0 1-10 0V8"></path>
                <path d="M7 8V6a5 5 0 0 1 10 0v2"></path>
                <path d="M12 18v2a2 2 0 0 0 4 0v-2"></path>
                <path d="M8 18v2a2 2 0 0 1-4 0v-2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <CreateNewEmployee
          employeeData={editEmployeeData} 
          onClose={handleCloseModal} 
          onSuccess={() => {
            handleCloseModal();
            console.log("Employee updated successfully!");
          }}
        />
      )}
    </>
  );
}