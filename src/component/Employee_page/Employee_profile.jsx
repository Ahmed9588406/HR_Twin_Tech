import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, TrendingUp, QrCode, Edit, Trash2, LogOut, UserCheck, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import { markAttendance, fetchEmployeeProfile, markLeave, fetchEmployeeSalary, fetchEmployeeAttendanceHistory } from '../Employee_page/api/emplyee_api';
import AttendanceModal from './Attendance_modal';
import OnLeaveModal from './OnLeave_modal';
import EmployeeSalaryCard from './employee_salary';
import EmployeeAttendanceHistory from './employee_history';
import EmployeeShiftDept from './employee_shift_dept_admin';
import { t as _t, getLang as _getLang, subscribe as _subscribe, setLang as _setLang } from '../../i18n/i18n';

const TEXT = {
  en: {
    sendWarning: 'Termination Warning',
    warningSent: 'Termination notice sent successfully!',
    warningError: 'Failed to send termination notice.',
    confirmSendWarning: 'Are you sure you want to send a termination notice to this employee? This action cannot be undone.'
  },
  ar: {
    sendWarning: 'انذار فصل ',
    warningSent: 'تم إرسال إشعار الفصل بنجاح!',
    warningError: 'فشل في إرسال إشعار الفصل.',
    confirmSendWarning: 'هل أنت متأكد من أنك تريد إرسال إشعار الفصل لهذا الموظف؟ هذا الإجراء لا يمكن التراجع عنه.'
  }
};

export default function EmployeeProfile() {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    _setLang(next);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {};
  const [profileData, setProfileData] = useState(null);
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
        const [profile, salary, history] = await Promise.all([
          fetchEmployeeProfile(employee.code),
          fetchEmployeeSalary(employee.code),
          fetchEmployeeAttendanceHistory(employee.code, 0, 5),
        ]);
        console.log('[Employee_profile] Fetched employee profile data:', profile);
        console.log('[Employee_profile] Fetched employee salary data:', salary);
        console.log('[Employee_profile] Fetched employee attendance history:', history);
        
        setProfileData(profile);
        setSalaryData(salary);
        setHistoryData(history);

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

  const handleSendWarning = async () => {
    const confirmed = window.confirm(TEXT[lang].confirmSendWarning);
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Auth token not found; please log in again.');
      }

      const response = await fetch(`https://api.shl-hr.com/api/v1/employees/termination-notice/${employee.code}`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to send termination notice: ${response.status}`);
      }

      const result = await response.json(); // Assuming it returns a boolean
      if (result) {
        alert(TEXT[lang].warningSent);
      } else {
        alert(TEXT[lang].warningError);
      }
    } catch (error) {
      console.error('Error sending termination notice:', error);
      alert(TEXT[lang].warningError);
    }
  };

  // Helper function to format last sign-in date
  const formatLastSignIn = (dateString) => {
    if (!dateString) return { display: _t('NA'), fullDate: _t('NA') };
    
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const timeStr = date.toLocaleString('en-US', timeOptions);
    
    let display;
    if (isToday) {
      display = `${_t('TODAY')}, ${timeStr}`;
    } else {
      const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const dateStr = date.toLocaleString('en-US', dateOptions);
      display = `${dateStr}, ${timeStr}`;
    }
    
    const fullDate = date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    return { display, fullDate };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING_PROFILE')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || _t('NO_EMPLOYEE_DATA')}</h2>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {_t('GO_TO_DASHBOARD')}
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
    : { display: employee.checkInTime || _t('NA'), fullDate: employee.checkInTime || _t('NA') };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">{_t('BACK_TO_DASHBOARD')}</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              {_t('EMPLOYEE_PORTAL')}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                aria-label={lang === 'en' ? _t('SWITCH_TO_ARABIC') : _t('SWITCH_TO_ENGLISH')}
              >
                {lang === 'en' ? 'EN' : 'ع'}
              </button>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {_t('ACTIVE_NOW')}
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
                    {profileData?.jobPosition || employee.jobPositionName || _t('NA')}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{_t('LAST_SIGNED_IN')} <strong title={lastSignIn.fullDate}>{lastSignIn.display}</strong></span>
                  </div>

                  <div className="flex gap-2 mt-6 w-full">
                    <button onClick={handleMarkAttendance} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      {_t('ATTENDANCE')}
                    </button>
                    <button onClick={handleMarkLeave} className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      {_t('LEAVE')}
                    </button>
                  </div>

                  {/* Send Warning Button */}
                  <div className="mt-4 w-full">
                    <button onClick={handleSendWarning} className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {TEXT[lang].sendWarning}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{profileData?.absencesCount || employee.absenceDays || 0}</div>
                      <div className="text-xs text-slate-600 mt-1">{_t('ABSENCE')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{employee.leaveTime ? 'Yes' : 'No'}</div>
                      <div className="text-xs text-slate-600 mt-1">{_t('ON_LEAVE')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{profileData?.daysLeftInVacation || employee.remainingDays || 0}</div>
                      <div className="text-xs text-slate-600 mt-1">{_t('DAYS_LEFT')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <EmployeeShiftDept empCode={employee.code} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Rate Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    {_t('ATTENDANCE_RATE')}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{_t('BASED_ON_RECENT')}</p>
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