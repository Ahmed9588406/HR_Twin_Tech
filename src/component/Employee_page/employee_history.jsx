import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

// Constants for hard-coded values
const NO_HISTORY_MESSAGE = "No attendance history available.";
const ATTENDANCE_HISTORY_TITLE = "Attendance History";
const RECENT_RECORDS_SUBTITLE = "Recent attendance records";
const TABLE_HEADERS = {
  DATE: "Date",
  CHECK_IN: "Check In",
  CHECK_OUT: "Check Out",
  WORKING_HOURS: "Working Hours",
  STATUS: "Status"
};
const NA_VALUE = "N/A";
const STATUS_VALUES = {
  PRESENT: 'PRESENT',
  ABSENT: 'Apsent',
  DAY_OFF: 'DAY_OFF',
  HOLIDAY: 'HOLIDAY'
};
const SHOWING_RECORDS_MESSAGE = "Showing {numberOfElements} of {totalElements} records";

// Replace / improve status handling: normalize incoming values and provide display strings
const normalizeStatus = (raw) => {
  if (!raw) return 'OTHER';
  const s = String(raw).trim().toUpperCase();

  // common corrections / mappings
  if (s === 'APSENT' || s === 'APESENT' || s === 'ABSENT' || s === 'ABSENTED' || s === 'Apsent'.toUpperCase()) return 'ABSENT';
  if (s.includes('PRESENT')) return 'PRESENT';
  if (s.includes('WEEKEND')) return 'WEEKEND';
  if (s.includes('HOLIDAY') || s.includes('DAY_OFF') || s.includes('DAY OFF') || s.includes('DAY-OFF')) return 'DAY_OFF';
  if (s.includes('LEAVE') || s.includes('ON_LEAVE')) return 'ON_LEAVE';
  // keep ABSENT mapping broad (catch "APSENT", "APSENT")
  if (s === 'APSENT') return 'ABSENT';

  return s || 'OTHER';
};

const DISPLAY_STATUS = {
  ABSENT: 'Absent',
  PRESENT: 'Present',
  WEEKEND: 'Weekend',
  DAY_OFF: 'Day Off - Holiday',
  ON_LEAVE: 'On Leave',
  OTHER: 'Status'
};

export default function EmployeeAttendanceHistory({ historyData }) {
  const getStatusIcon = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'PRESENT':
        return 'text-green-700 bg-green-50';
      case 'ABSENT':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  if (!historyData || !historyData.content || historyData.content.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">{NO_HISTORY_MESSAGE}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {ATTENDANCE_HISTORY_TITLE}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{RECENT_RECORDS_SUBTITLE}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{TABLE_HEADERS.DATE}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{TABLE_HEADERS.CHECK_IN}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{TABLE_HEADERS.CHECK_OUT}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{TABLE_HEADERS.WORKING_HOURS}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{TABLE_HEADERS.STATUS}</th>
            </tr>
          </thead>
          <tbody>
            {historyData.content.map((record, index) => {
              const normStatus = normalizeStatus(record.status);
              const isAbsent = normStatus === 'ABSENT';
              const isDayOff = normStatus === 'DAY_OFF';
              const isWeekend = normStatus === 'WEEKEND';
              const isOnLeave = normStatus === 'ON_LEAVE';
              const isSpecialStatus = isAbsent || isDayOff || isWeekend || isOnLeave;

              console.log('Record status:', record.status, 'isAbsent:', isAbsent, 'isSpecialStatus:', isSpecialStatus);

              return (
                <tr key={record.attendanceId || index} className={`border-b border-slate-100 transition-colors ${
                  isSpecialStatus ? (isAbsent ? 'bg-red-50' : 'bg-green-50') : 'hover:bg-slate-50'
                }`}>
                  <td className="py-4 px-4 text-slate-800 font-medium">
                    {(() => {
                      const dayStr = record.day || '';
                      const d = new Date(dayStr.includes('T') ? dayStr : `${dayStr}T00:00:00`);
                      return d.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    })()}
                  </td>

                  {isSpecialStatus ? (
                    <td colSpan={4} className="py-4 px-4 text-center">
                      <div className={`text-xl font-semibold ${isAbsent ? 'text-red-600' : 'text-green-600'}`}>
                        {DISPLAY_STATUS[normStatus] || String(record.status || '').trim()}
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {record.checkIn || NA_VALUE}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          {record.checkOut || NA_VALUE}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {record.workingHours || NA_VALUE}
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {DISPLAY_STATUS[normalizeStatus(record.status)] || record.status}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {historyData.totalPages > 1 && (
        <div className="mt-4 text-center text-sm text-slate-500">
          {SHOWING_RECORDS_MESSAGE.replace('{numberOfElements}', historyData.numberOfElements).replace('{totalElements}', historyData.totalElements)}
        </div>
      )}
    </div>
  );
}
