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

const TEXT = {
  en: {
    changePhotoAria: 'Change photo',
    attendanceMarked: 'Attendance marked successfully!',
    leaveMarked: 'Leave marked successfully!',
    attendanceFail: 'Failed to mark attendance:',
    leaveFail: 'Failed to mark leave:',
    lastSignInPrefix: 'Last sign in:',
    naValue: 'N/A',
    defaultJobPosition: 'Employee',
    attendance: 'Attendance',
    leave: 'Leave',
    statAbsence: 'Absence',
    statOnLeave: 'On Leave',
    statDaysLeft: 'Days Left',
    onLeaveYes: 'Yes',
    onLeaveNo: 'No'
  },
  ar: {
    changePhotoAria: 'تغيير الصورة',
    attendanceMarked: 'تم تسجيل الحضور بنجاح!',
    leaveMarked: 'تم تسجيل الإجازة بنجاح!',
    attendanceFail: 'فشل في تسجيل الحضور:',
    leaveFail: 'فشل في تسجيل الإجازة:',
    lastSignInPrefix: 'آخر تسجيل دخول:',
    naValue: 'غير متوفر',
    defaultJobPosition: 'موظف',
    attendance: 'الحضور',
    leave: 'الإجازة',
    statAbsence: 'الغياب',
    statOnLeave: 'في إجازة',
    statDaysLeft: 'الأيام المتبقية',
    onLeaveYes: 'نعم',
    onLeaveNo: 'لا'
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
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

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
      // Mark attendance with location
      const result = await markAttendance(location.latitude, location.longitude);
      // Show success message instead of opening modal
      alert(copy.attendanceMarked);
      // Optionally reload to refresh attendance history
      window.location.reload();
    } catch (error) {
      alert(`${copy.attendanceFail} ${error.message}`);
    }
  };

  const handleMarkLeave = async () => {
    try {
      const location = await getCurrentLocation();
      // Mark leave with location
      const result = await markLeave(location.latitude, location.longitude);
      // Show success message
      alert(copy.leaveMarked);
      // Optionally reload to refresh data
      window.location.reload();
    } catch (error) {
      alert(`${copy.leaveFail} ${error.message}`);
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
      window.location.reload(); // Or update photoSrc dynamically if the response includes new URL
    } catch (error) {
      // Log full server error for debugging
      console.error('Upload photo error:', error);

      // Present a friendly localized message to the user and keep the server message in console
      const friendly = _t('FAILED_UPLOAD_PHOTO') || copy.attendanceFail || 'Failed to upload photo';
      setUploadError(`${friendly}: ${error.message ? error.message : ''}`);
      // Optionally also show alert
      alert(`${friendly}.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200" dir={dir} lang={lang}>
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
              aria-label={copy.changePhotoAria}
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
          <p className="text-green-600 font-medium mt-1">{formatAvesntWord(profileData?.jobPosition || copy.defaultJobPosition)}</p>

          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>
              {copy.lastSignInPrefix}<strong>
                {profileData?.lastSignIn ? formatLastSignIn(profileData.lastSignIn).display : copy.naValue}
              </strong>
            </span>
          </div>

          {/* Attendance / Leave buttons */}
          <div className="flex gap-3 mt-6 w-full">
            <button 
              onClick={handleMarkAttendance}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <UserCheck className="w-5 h-5" /> {copy.attendance}
            </button>
            <button 
              onClick={handleMarkLeave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <LogOut className="w-5 h-5" /> {copy.leave}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {profileData?.absencesCount ?? 0}
              </div>
              <div className="text-xs text-slate-600 mt-1">{copy.statAbsence}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {profileData?.onLeave ? copy.onLeaveYes : copy.onLeaveNo}
              </div>
              <div className="text-xs text-slate-600 mt-1">{copy.statOnLeave}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">
                {profileData?.daysLeftInVacation ?? 0}
              </div>
              <div className="text-xs text-slate-600 mt-1">{copy.statDaysLeft}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
