import React, { useRef, useState, useEffect } from 'react';
import { Clock, UserCheck, LogOut, Camera } from 'lucide-react';
import { uploadEmployeePhoto, markAttendance, markLeave } from './employee_role_api';
import { requestNotificationPermission } from '../firebase_config';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

// add helper to normalize the word "Avesnt" (any case) to "Avesnt"
const formatAvesntWord = (text) => {
		if (!text) return text;
		try {
			return String(text).replace(/\bavesnt\b/ig, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
		} catch {
			return text;
		}
};

export default function UserProfile({ 
  profileData, 
  user, 
  photoSrc, 
  formatLastSignIn, 
  onMarkAttendance, 
  onRequestLeave 
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // language subscription to force re-render when language changes
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  // replace constants with t() lookup
  const DEFAULT_JOB_POSITION = _t('DEFAULT_JOB_POSITION');
  const LAST_SIGN_IN_PREFIX = _t('LAST_SIGN_IN_PREFIX');
  const NA_VALUE = _t('NA_VALUE');

  const BUTTON_LABELS = {
    MARK_ATTENDANCE: _t('BUTTON_MARK_ATTENDANCE'),
    REQUEST_LEAVE: _t('BUTTON_REQUEST_LEAVE')
  };
  const STAT_LABELS = {
    ABSENCE: _t('STAT_ABSENCE'),
    ON_LEAVE: _t('STAT_ON_LEAVE'),
    DAYS_LEFT: _t('STAT_DAYS_LEFT')
  };
  const ON_LEAVE_VALUES = {
    YES: _t('ON_LEAVE_YES'),
    NO: _t('ON_LEAVE_NO')
  };

  useEffect(() => {
    const fetchAndLogToken = async () => {
      try {
        console.log('[UserProfile] 🔔 Requesting FCM token...');
        console.log('[UserProfile] 🌐 Current URL:', window.location.href);
        console.log('[UserProfile] 🔒 Secure Context:', window.isSecureContext);
        
        const token = await requestNotificationPermission();
        if (token) {
          console.log('[UserProfile] ✅ Employee FCM Token:', token);
          console.log('[UserProfile] 📋 Token Length:', token.length);
        } else {
          console.log('[UserProfile] ⚠️ FCM Token not available');
          console.log('[UserProfile] 💡 Check the detailed logs above for the reason');
        }
      } catch (error) {
        console.warn('[UserProfile] ❌ Error fetching FCM token:', error);
      }
    };

    // Don't await - run in background
    fetchAndLogToken();
  }, []);

  // Function to get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const handleMarkAttendance = async () => {
    try {
      const location = await getCurrentLocation();
      console.log('Employee current location:', location);
      // Mark attendance with location
      const result = await markAttendance(location.latitude, location.longitude);
      console.log('Attendance marked successfully:', result);
      // Show success message instead of opening modal
      alert('Attendance marked successfully!');
      // Optionally reload to refresh attendance history
      window.location.reload();
    } catch (error) {
      console.error('Failed to get location or mark attendance:', error.message);
      alert(`Failed to mark attendance: ${error.message}`);
    }
  };

  const handleMarkLeave = async () => {
    try {
      const location = await getCurrentLocation();
      console.log('Employee current location for leave:', location);
      // Mark leave with location
      const result = await markLeave(location.latitude, location.longitude);
      console.log('Leave marked successfully:', result);
      // Show success message
      alert('Leave marked successfully!');
      // Optionally reload to refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to get location or mark leave:', error.message);
      alert(`Failed to mark leave: ${error.message}`);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type (e.g., images only)
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      await uploadEmployeePhoto(user.code, file);
      // On success, refresh the photoSrc (assuming the API updates the profile)
      // For simplicity, you can reload the page or update photoSrc with a new URL if provided
      window.location.reload(); // Or update photoSrc dynamically if the response includes new URL
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  console.log('UserProfile props:', { profileData, user, photoSrc });
  console.log('UserProfile profileData (endpoint return):', profileData);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="h-32 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center -mt-16">
          <div className="relative">
            <img 
              src={photoSrc} 
              alt={formatAvesntWord(profileData?.empName || user.username)} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover" 
            />
            <button
              onClick={handleIconClick}
              className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label={_t('CHANGE_PHOTO_ARIA')}
              disabled={uploading}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}

          <h2 className="mt-4 text-2xl font-bold text-slate-800">
            {formatAvesntWord(profileData?.empName || user.username)}
          </h2>
          <p className="text-green-600 font-medium mt-1">{formatAvesntWord(profileData?.jobPosition || DEFAULT_JOB_POSITION)}</p>

          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>
              {LAST_SIGN_IN_PREFIX}<strong>
                {profileData?.lastSignIn ? formatLastSignIn(profileData.lastSignIn).display : NA_VALUE}
              </strong>
            </span>
          </div>

          {/* Attendance / Leave buttons */}
          <div className="flex gap-2 mt-6 w-full">
            <button 
              onClick={handleMarkAttendance} // Use the new handler
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> {BUTTON_LABELS.MARK_ATTENDANCE}
            </button>
            <button 
              onClick={handleMarkLeave}
              className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> {BUTTON_LABELS.REQUEST_LEAVE}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {profileData?.absencesCount ?? 0}
              </div>
              <div className="text-xs text-slate-600 mt-1">{STAT_LABELS.ABSENCE}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {profileData?.onLeave ? ON_LEAVE_VALUES.YES : ON_LEAVE_VALUES.NO}
              </div>
              <div className="text-xs text-slate-600 mt-1">{STAT_LABELS.ON_LEAVE}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {profileData?.daysLeftInVacation ?? 0}
              </div>
              <div className="text-xs text-slate-600 mt-1">{STAT_LABELS.DAYS_LEFT}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
