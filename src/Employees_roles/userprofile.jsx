import React from 'react';
import { Clock, UserCheck, LogOut } from 'lucide-react';

// Constants for hard-coded values
const DEFAULT_JOB_POSITION = 'Employee';
const LAST_SIGN_IN_PREFIX = 'Last signed in: ';
const NA_VALUE = 'N/A';
const BUTTON_LABELS = {
  MARK_ATTENDANCE: 'Mark Attendance',
  REQUEST_LEAVE: 'Request Leave'
};
const STAT_LABELS = {
  ABSENCE: 'Absence',
  ON_LEAVE: 'On Leave',
  DAYS_LEFT: 'Days Left'
};
const ON_LEAVE_VALUES = {
  YES: 'Yes',
  NO: 'No'
};

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
            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white bg-green-500 animate-pulse" />
          </div>

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
              onClick={onMarkAttendance} 
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> {BUTTON_LABELS.MARK_ATTENDANCE}
            </button>
            <button 
              onClick={onRequestLeave} 
              className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
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
