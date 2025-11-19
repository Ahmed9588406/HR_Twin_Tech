import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchEmployeeProfile } from './employee_role_api';
import UserProfile from './userprofile';
import EmployeeAttendanceHistory from './employee_role_history';
import AttendanceModal from '../component/Employee_page/Attendance_modal';
import OnLeaveModal from '../component/Employee_page/OnLeave_modal';
import EmployeeSalary from './employee_salary';
import EmployeeRewards from './rewards';
import EmployeeDiscounts from './discount';

// Constants for hard-coded values
const DEFAULT_USERNAME = 'Employee';
const DEFAULT_ROLE = 'USER';
const LOCAL_STORAGE_KEYS = {
  ROLE: 'role',
  CODE: 'code',
  USER_DATA: 'userData'
};
const UI_TEXT = {
  MY_PROFILE: 'My Profile',
  ACTIVE_STATUS: 'Active',
  LOADING_MESSAGE: 'Loading profile...',
  ERROR_MESSAGE: 'Failed to load detailed profile. Showing basic info.',
  TODAY_PREFIX: 'Today, ',
  NA_VALUE: 'N/A'
};
const DATE_FORMAT_OPTIONS = {
  TIME: { hour: '2-digit', minute: '2-digit' },
  SHORT_DATE: { weekday: 'short', month: 'short', day: 'numeric' },
  FULL_DATE: {}
};

export default function UserProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: DEFAULT_USERNAME, role: DEFAULT_ROLE, code: null });
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) || DEFAULT_ROLE;
    const code = localStorage.getItem(LOCAL_STORAGE_KEYS.CODE) || null;
    let username = DEFAULT_USERNAME;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
      if (raw) {
        const parsed = JSON.parse(raw);
        username = parsed?.username || parsed?.sub || username;
      }
    } catch {
      // ignore
    }
    setUser({ username, role, code });

    const load = async () => {
      if (!code) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        // Fetch profile only; attendance is fetched inside EmployeeAttendanceHistory component
        try {
          const profile = await fetchEmployeeProfile(code);
          setProfileData(profile);
        } catch (profileErr) {
          console.error('Failed to load profile:', profileErr);
          setError(UI_TEXT.ERROR_MESSAGE);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleBack = () => navigate('/user-dashboard');
  
  const formatLastSignIn = (dateString) => {
    if (!dateString) return { display: UI_TEXT.NA_VALUE, fullDate: UI_TEXT.NA_VALUE };
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleString('en-US', DATE_FORMAT_OPTIONS.TIME);
    const display = isToday ? `${UI_TEXT.TODAY_PREFIX}${timeStr}` : `${date.toLocaleString('en-US', DATE_FORMAT_OPTIONS.SHORT_DATE)}, ${timeStr}`;
    return { display, fullDate: date.toLocaleString('en-US', DATE_FORMAT_OPTIONS.FULL_DATE) };
  };

  const photoSrc = profileData?.empPhoto
    ? `data:${profileData.contentType || 'image/jpeg'};base64,${profileData.empPhoto}`
    : (user && user.code ? `https://i.pravatar.cc/150?u=${user.code}` : 'https://i.pravatar.cc/150?img=12');

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto" />
          <p className="mt-4 text-gray-600">{UI_TEXT.LOADING_MESSAGE}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              {UI_TEXT.MY_PROFILE}
            </h1>
            <div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{UI_TEXT.ACTIVE_STATUS}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <UserProfile
              profileData={profileData}
              user={user}
              photoSrc={photoSrc}
              formatLastSignIn={formatLastSignIn}
              onMarkAttendance={() => setShowAttendanceModal(true)}
              onRequestLeave={() => setShowLeaveModal(true)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <EmployeeAttendanceHistory empCode={user.code} />
            <EmployeeSalary empCode={user.code} />
            <EmployeeRewards empCode={user.code} />
            <EmployeeDiscounts empCode={user.code} />
          </div>
        </div>
      </div>

      {/* Modals (optional) */}
      {showAttendanceModal && profileData && (
        <AttendanceModal
          employee={{ code: user.code }}
          onClose={() => setShowAttendanceModal(false)}
          onSuccess={() => { setShowAttendanceModal(false); /* refresh maybe */ }}
        />
      )}

      {showLeaveModal && profileData && (
        <OnLeaveModal
          employee={{ code: user.code }}
          onClose={() => setShowLeaveModal(false)}
          onSuccess={() => { setShowLeaveModal(false); /* refresh maybe */ }}
        />
      )}
    </div>
  );
}
