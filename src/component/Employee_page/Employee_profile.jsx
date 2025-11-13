import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, TrendingUp, QrCode, Edit, Trash2, LogOut, UserCheck, ArrowLeft } from 'lucide-react';

export default function EmployeeProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {};
  const [activeTab, setActiveTab] = useState('attendance');

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

  const attendanceData = [
    { date: 'Thu Nov 13', checkIn: '10:00', checkOut: '-', hours: '-', status: 'active' },
    { date: 'Wed Nov 12', checkIn: '10:01', checkOut: '18:22', hours: '8:00', status: 'complete' },
    { date: 'Tue Nov 11', checkIn: '10:00', checkOut: '18:01', hours: '8:00', status: 'complete' },
    { date: 'Mon Nov 10', checkIn: '10:01', checkOut: '18:10', hours: '8:00', status: 'complete' },
    { date: 'Sun Nov 09', checkIn: '10:00', checkOut: '18:09', hours: '8:00', status: 'complete' },
    { date: 'Sat Nov 08', checkIn: '10:00', checkOut: '18:06', hours: '8:00', status: 'complete' },
  ];

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
                      src={employee.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
                      alt={employee.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${currentStatus.dotColor} animate-pulse`} />
                  </div>
                  
                  <h2 className="mt-4 text-2xl font-bold text-slate-800">{employee.name}</h2>
                  <p className="text-green-600 font-medium mt-1">{employee.role}</p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Last signed in: <strong>{employee.checkInTime || '10:00 Today'}</strong></span>
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

                  <div className="flex gap-2 mt-3 w-full">
                    <button className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-slate-100 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">0</div>
                    <div className="text-xs text-slate-600 mt-1">Absence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">✕</div>
                    <div className="text-xs text-slate-600 mt-1">On Leave</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">0</div>
                    <div className="text-xs text-slate-600 mt-1">Days Left</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                Scan QR to Login
              </h3>
              <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center">
                <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-inner">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="white"/>
                    {[...Array(10)].map((_, i) => 
                      [...Array(10)].map((_, j) => {
                        const shouldFill = (i + j) % 2 === 0 || (i === j) || (i === 9 - j);
                        return shouldFill ? (
                          <rect 
                            key={`${i}-${j}`}
                            x={i * 10} 
                            y={j * 10} 
                            width="10" 
                            height="10" 
                            fill="black"
                          />
                        ) : null;
                      })
                    )}
                  </svg>
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
                    100%
                  </div>
                </div>
              </div>
              
              <div className="h-8 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-[2%] bg-amber-400"></div>
                <div className="w-[3%] bg-cyan-400"></div>
                <div className="w-[95%] bg-gradient-to-r from-emerald-500 to-green-500"></div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-slate-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                  <span className="text-slate-600">Delay</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">On Time</span>
                </div>
              </div>
            </div>

            {/* Salary Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Salary Details</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                  <div className="text-sm text-slate-600 mb-1">Total Days</div>
                  <div className="text-3xl font-bold text-slate-800">26</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                  <div className="text-sm text-slate-600 mb-1">Total Hours</div>
                  <div className="text-3xl font-bold text-slate-800">208.0 h</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="text-sm text-slate-600 mb-1">Salary</div>
                  <div className="text-3xl font-bold text-slate-800">8000.0</div>
                  <div className="text-xs text-slate-600 mt-1">EGP</div>
                </div>
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Attendance History
                </h3>
              </div>
              
              <div className="overflow-x-auto overflow-y-auto max-h-96">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {attendanceData.map((day, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-800">{day.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-green-600 font-medium">{day.checkIn}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-red-600 font-medium">{day.checkOut}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-800 font-medium">{day.hours}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {day.status === 'active' ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}