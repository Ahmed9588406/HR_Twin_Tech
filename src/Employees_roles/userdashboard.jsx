import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, UserCheck, LogOut } from 'lucide-react';
import { fetchEmployeeDetails } from './employee_role_api';
import AttendanceModal from '../component/Employee_page/Attendance_modal';
import OnLeaveModal from '../component/Employee_page/OnLeave_modal';

export default function UserProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'Employee', role: 'USER', code: null });
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role') || 'USER';
    const code = localStorage.getItem('code') || null;
    let username = 'Employee';
    try {
      const raw = localStorage.getItem('userData');
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
        const profile = await fetchEmployeeDetails(code);
        setProfileData(profile);
      } catch (err) {
        console.error('Failed to load user profile data:', err);
        setError('Failed to load detailed profile. Showing basic info.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleBack = () => navigate('/user-dashboard');
  const formatLastSignIn = (dateString) => {
    if (!dateString) return { display: 'N/A', fullDate: 'N/A' };
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    const display = isToday ? `Today, ${timeStr}` : `${date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, ${timeStr}`;
    return { display, fullDate: date.toLocaleString('en-US') };
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
              My Profile
            </h1>
            <div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (no edit icons) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="h-32 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-16">
                  <div className="relative">
                    <img src={photoSrc} alt={profileData?.empName || user.username} className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white bg-green-500 animate-pulse" />
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-slate-800">
                    {profileData?.empName || user.username}
                  </h2>
                  <p className="text-green-600 font-medium mt-1">{profileData?.jobPosition || 'Employee'}</p>

                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Last signed in: <strong>{profileData?.lastSignIn ? formatLastSignIn(profileData.lastSignIn).display : 'N/A'}</strong></span>
                  </div>

                  {/* Attendance / Leave buttons (optional for user) */}
                  <div className="flex gap-2 mt-6 w-full">
                    <button onClick={() => setShowAttendanceModal(true)} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <UserCheck className="w-4 h-4" /> Mark Attendance
                    </button>
                    <button onClick={() => setShowLeaveModal(true)} className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" /> Request Leave
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 w-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{profileData?.absencesCount ?? 0}</div>
                      <div className="text-xs text-slate-600 mt-1">Absence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{profileData?.onLeave ? 'Yes' : 'No'}</div>
                      <div className="text-xs text-slate-600 mt-1">On Leave</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{profileData?.daysLeftInVacation ?? 0}</div>
                      <div className="text-xs text-slate-600 mt-1">Days Left</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Removed attendance rate, salary, and history sections */}
          <div className="lg:col-span-2">
            {/* No additional content */}
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
