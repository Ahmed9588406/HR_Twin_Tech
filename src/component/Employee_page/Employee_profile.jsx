import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, TrendingUp, QrCode, Edit, Trash2, LogOut, UserCheck, ArrowLeft, Info } from 'lucide-react';
import { markAttendance, fetchEmployeeProfile, markLeave, fetchEmployeeSalary, fetchEmployeeAttendanceHistory } from '../Employee_page/api/emplyee_api';
import { fetchEmployeeDetails } from './informations';
import AttendanceModal from './Attendance_modal';
import OnLeaveModal from './OnLeave_modal';
import EmployeeSalaryCard from './employee_salary';
import EmployeeAttendanceHistory from './employee_history';

export default function EmployeeProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {};
  const [profileData, setProfileData] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [attendanceRate, setAttendanceRate] = useState(0);

  // Status configurations matching EmployeeCard
  const statusConfig = {
    "Present": { dotColor: "bg-emerald-500" },
    "Checked out": { dotColor: "bg-gray-400" },
    "Absent": { dotColor: "bg-red-500" },
    "On Leave": { dotColor: "bg-yellow-500" },
    "On break": { dotColor: "bg-amber-500" },
    "In meeting": { dotColor: "bg-blue-500" },
    "present": { dotColor: "bg-green-500" },
    "absent": { dotColor: "bg-red-500" },
    "on-leave": { dotColor: "bg-yellow-500" }
  };

  // Fetch employee profile, salary, and attendance history data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!employee || !employee.code) {
        setError('No employee code available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [profile, salary, history, details] = await Promise.all([
          fetchEmployeeProfile(employee.code),
          fetchEmployeeSalary(employee.code),
          fetchEmployeeAttendanceHistory(employee.code, 0, 5),
          fetchEmployeeDetails(employee.code)
        ]);
        console.log('[Employee_profile] Fetched employee profile data:', profile);
        console.log('[Employee_profile] Fetched employee salary data:', salary);
        console.log('[Employee_profile] Fetched employee attendance history:', history);
        console.log('[Employee_profile] Fetched employee details:', details);
        console.log('[Employee_profile] Details shift:', details?.shift);
        console.log('[Employee_profile] Details branch:', details?.branch);
        console.log('[Employee_profile] Details department:', details?.department);
        console.log('[Employee_profile] Details jobPosition:', details?.jobPosition);
        
        setProfileData(profile);
        setSalaryData(salary);
        setHistoryData(history);
        setDetailsData(details);

        // Calculate attendance rate from history
        if (history && history.content && history.content.length > 0) {
          const totalRecords = history.content.length;
          const presentRecords = history.content.filter(record => record.status === 'PRESENT').length;
          const rate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;
          setAttendanceRate(rate);
        }
      } catch (err) {
        console.error('[Employee_profile] Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employee]);

  const handleMarkAttendance = () => {
    setShowAttendanceModal(true);
  };

  const handleMarkLeave = () => {
    setShowLeaveModal(true);
  };

  const handleAttendanceSuccess = () => {
    alert('Attendance marked successfully!');
    // Optionally refresh profile data
  };

  const handleLeaveSuccess = () => {
    alert('Leave marked successfully!');
    // Optionally refresh profile data
  };

  // Helper function to format last sign-in date
  const formatLastSignIn = (dateString) => {
    if (!dateString) return { display: 'N/A', fullDate: 'N/A' };
    
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const timeOptions = { 
      hour: '2-digit',
      minute: '2-digit'
    };
    const timeStr = date.toLocaleString('en-US', timeOptions);
    
    let display;
    if (isToday) {
      display = `Today, ${timeStr}`;
    } else {
      const dateOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      };
      const dateStr = date.toLocaleString('en-US', dateOptions);
      display = `${dateStr}, ${timeStr}`;
    }
    
    const fullDate = date.toLocaleString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return { display, fullDate };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'No Employee Data'}</h2>
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
  const photoSrc = profileData?.empPhoto 
    ? `data:${profileData.contentType || 'image/jpeg'};base64,${profileData.empPhoto}`
    : (employee.contentType && employee.data 
        ? `data:${employee.contentType};base64,${employee.data}` 
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop");

  const lastSignIn = profileData?.lastSignIn 
    ? formatLastSignIn(profileData.lastSignIn) 
    : { display: employee.checkInTime || 'N/A', fullDate: employee.checkInTime || 'N/A' };

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
                    <img
                      src={photoSrc}
                      alt={profileData?.empName || employee.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${currentStatus.dotColor} animate-pulse`} />
                  </div>
                  
                  <h2 className="mt-4 text-2xl font-bold text-slate-800">
                    {profileData?.empName || employee.name}
                  </h2>
                  <p className="text-green-600 font-medium mt-1">
                    {profileData?.jobPosition || employee.jobPositionName || 'N/A'}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Last signed in: <strong title={lastSignIn.fullDate}>{lastSignIn.display}</strong></span>
                  </div>

                  <div className="flex gap-2 mt-6 w-full">
                    <button 
                      onClick={handleMarkAttendance}
                      className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Attendance
                    </button>
                    <button 
                      onClick={handleMarkLeave}
                      className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Leave
                    </button>
                  </div>

                  {/* Employee Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Department</p>
                        <p className="font-semibold text-gray-800">{detailsData?.department || profileData?.department || employee.department || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Shift</p>
                        <p className="font-semibold text-gray-800">{detailsData?.shift || profileData?.shift || employee.shift || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-semibold text-gray-800">{detailsData?.jobPosition || profileData?.jobPosition || employee.jobPositionName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Branch</p>
                        <p className="font-semibold text-gray-800">{detailsData?.branch || profileData?.branch || employee.branch || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">
                      {profileData?.absencesCount || employee.absenceDays || 0}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Absence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {employee.leaveTime ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">On Leave</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">
                      {profileData?.daysLeftInVacation || employee.remainingDays || 0}
                    </div>
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
                  <p className="text-sm text-slate-600 mt-1">Based on recent records</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                    {attendanceRate.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="h-8 bg-slate-100 rounded-full overflow-hidden flex">
                <div className={`w-[${attendanceRate}%] bg-gradient-to-r from-emerald-500 to-green-500`}></div>
                <div className={`w-[${100 - attendanceRate}%] bg-amber-400`}></div>
              </div>
            </div>

            {/* Salary Details Card */}
            <EmployeeSalaryCard salaryData={salaryData} />

            {/* Attendance History Table */}
            <EmployeeAttendanceHistory historyData={historyData} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAttendanceModal && (
        <AttendanceModal
          employee={employee}
          onClose={() => setShowAttendanceModal(false)}
          onSuccess={handleAttendanceSuccess}
        />
      )}

      {showLeaveModal && (
        <OnLeaveModal
          employee={employee}
          onClose={() => setShowLeaveModal(false)}
          onSuccess={handleLeaveSuccess}
        />
      )}
    </div>
  );
}