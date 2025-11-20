import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { fetchEmployeeProfile } from './employee_role_api';
import UserProfile from './userprofile';
import EmployeeAttendanceHistory from './employee_role_history';
import EmployeeSalary from './employee_salary';
import EmployeeRewards from './rewards';
import EmployeeDiscounts from './discount';
import EmployeeRequests from './emp_requests';
import VacationRequest from './vacation_req';
import AdvanceRequest from './advance_req';
import { NotificationModal } from '../component/ui/notification';
import { onMessageListener, showBrowserNotification } from '../firebase_config';
import EmployeeShiftDept from './employee_shift_dept';

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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const notificationButtonRef = useRef(null);

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

  useEffect(() => {
    // Listen for foreground notifications
    onMessageListener()
      .then((payload) => {
        console.log('Foreground notification received:', payload);
        showBrowserNotification(
          payload.notification?.title || 'New Notification',
          {
            body: payload.notification?.body || 'You have a new notification',
            tag: payload.data?.id || 'notification',
            data: payload.data
          }
        );
      })
      .catch((err) => console.error('Failed to receive foreground message:', err));
  }, []);

  const handleBack = () => navigate('/user-dashboard');
  
  const handleAdvanceRequest = () => setShowAdvanceModal(true);

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
            <div className="flex items-center gap-4">
              <button
                ref={notificationButtonRef}
                onClick={() => setShowNotificationModal(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {/* Optional: Add unread count badge if you have access to notifications state */}
                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
              </button>
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
              onMarkAttendance={() => {}} // Empty handler since marking is done in UserProfile
              onRequestLeave={() => setShowLeaveModal(true)}
            />
            <EmployeeShiftDept />
            <EmployeeRequests 
              onVacationRequest={() => setShowLeaveModal(true)} 
              onAdvanceRequest={handleAdvanceRequest} 
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

      {/* Centered draggable VacationRequest modal */}
      {showLeaveModal && (
        <VacationRequest
          employee={{ code: user.code }}
          onClose={() => setShowLeaveModal(false)}
          onSuccess={() => { setShowLeaveModal(false); /* optionally refresh profile */ }}
        />
      )}

      {/* Centered draggable AdvanceRequest modal */}
      {showAdvanceModal && (
        <AdvanceRequest
          employee={{ code: user.code }}
          onClose={() => setShowAdvanceModal(false)}
          onSuccess={() => { setShowAdvanceModal(false); /* optionally refresh profile */ }}
        />
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        buttonRef={notificationButtonRef}
        receiverCode={user.code}
      />
    </div>
  );
}
