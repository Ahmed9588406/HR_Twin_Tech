import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe, setLang as _setLang } from '../i18n/i18n';
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
const DATE_FORMAT_OPTIONS = {
  TIME: { hour: 'numeric', minute: 'numeric', hour12: true },
  SHORT_DATE: { month: 'short', day: 'numeric' },
  FULL_DATE: { year: 'numeric', month: 'long', day: 'numeric' }
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
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationButtonRef = useRef(null);

  // Language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    _setLang(next);
  };

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
          setError(_t('PROFILE_LOAD_ERROR_FALLBACK'));
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
        showBrowserNotification(
          payload.notification?.title || _t('DEFAULT_NOTIFICATION_TITLE'),
          {
            body: payload.notification?.body || _t('DEFAULT_NOTIFICATION_BODY'),
            tag: payload.data?.id || 'notification',
            data: payload.data
          }
        );
      })
      .catch((err) => console.error('Notification listener error:', err));
  }, []);


  
  const handleAdvanceRequest = () => setShowAdvanceModal(true);

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('code');
    localStorage.removeItem('userData');
    
    // Navigate to login page
    navigate('/');
  };

  const formatLastSignIn = (dateString) => {
    if (!dateString) return { display: _t('NA'), fullDate: _t('NA') };
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleString('en-US', DATE_FORMAT_OPTIONS.TIME);
    const display = isToday ? `${_t('TODAY')}, ${timeStr}` : `${date.toLocaleString('en-US', DATE_FORMAT_OPTIONS.SHORT_DATE)}, ${timeStr}`;
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
          <p className="mt-4 text-gray-600">{_t('LOADING_PROFILE')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                aria-label={lang === 'en' ? _t('SWITCH_TO_ARABIC') : _t('SWITCH_TO_ENGLISH')}
              >
                {lang === 'en' ? 'EN' : 'ع'}
              </button>
              <button
                ref={notificationButtonRef}
                onClick={() => setShowNotificationModal(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={_t('NOTIFICATIONS')}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                aria-label={_t('LOGOUT')}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">{_t('LOGOUT')}</span>
              </button>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{_t('ACTIVE_STATUS')}</span>
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
        onUnreadCountChange={setUnreadCount}
      />
    </div>
  );
}
