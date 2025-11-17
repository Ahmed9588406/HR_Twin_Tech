import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, TrendingUp, QrCode, Edit, Trash2, LogOut, UserCheck, ArrowLeft } from 'lucide-react';

export default function EmployeeProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {}; // Get the employee object from state

  // Log the employee data for debugging
  console.log('Employee data:', employee);

  // Status configurations matching EmployeeCard
  const statusConfig = {
    "Stay here": { dotColor: "bg-emerald-500" },
    "Checked out": { dotColor: "bg-gray-400" },
    "Absent": { dotColor: "bg-red-500" },
    "On Leave": { dotColor: "bg-yellow-500" },
    "On break": { dotColor: "bg-amber-500" },
    "In meeting": { dotColor: "bg-blue-500" },
    "present": { dotColor: "bg-green-500" },
    "absent": { dotColor: "bg-red-500" },
    "on-leave": { dotColor: "bg-yellow-500" }
  };

  // If no employee data, show default or redirect
  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Employee Data</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[employee.status] || statusConfig["present"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              Employee Portal
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active Now
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="h-32 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-16">
                  <div className="relative">
                    {/* Profile Image */}
                    <img
                      src={employee.contentType && employee.data 
                        ? `data:${employee.contentType};base64,${employee.data}` 
                        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
                      alt={employee.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${currentStatus.dotColor} animate-pulse`} />
                  </div>
                  
                  <h2 className="mt-4 text-2xl font-bold text-slate-800">{employee.name}</h2>
                  <p className="text-green-600 font-medium mt-1">{employee.jobPositionName || 'N/A'}</p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Last signed in: <strong>{employee.checkInTime || 'N/A'}</strong></span>
                  </div>

                  <div className="flex gap-2 mt-6 w-full">
                    <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Attendance
                    </button>
                    <button className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Leave
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{employee.absenceDays || 0}</div>
                    <div className="text-xs text-slate-600 mt-1">Absence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{employee.onLeaveDays || 0}</div>
                    <div className="text-xs text-slate-600 mt-1">On Leave</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{employee.remainingDays || 0}</div>
                    <div className="text-xs text-slate-600 mt-1">Days Left</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Rate Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Attendance Rate
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">Since last month</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                    {employee.attendanceRate || 'N/A'}%
                  </div>
                </div>
              </div>
              
              <div className="h-8 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-[2%] bg-amber-400"></div>
                <div className="w-[3%] bg-cyan-400"></div>
                <div className="w-[95%] bg-gradient-to-r from-emerald-500 to-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}