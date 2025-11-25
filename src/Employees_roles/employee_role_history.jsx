import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getLang as _getLang, subscribe as _subscribe, t as _t, getMonths } from '../i18n/i18n';

// API function
const fetchAttendanceRecords = async (empCode, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const now = new Date();
    const month = options.month !== undefined ? options.month : now.getMonth() + 1;
    const year = options.year !== undefined ? options.year : now.getFullYear();

    const url = `https://api.shl-hr.com/api/v1/emp-dashboard/attendance-history?month=${month}&year=${year}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const body = text || res.statusText;
      throw new Error(`Failed to fetch attendance history: ${res.status} - ${body}`);
    }

    const data = text ? JSON.parse(text) : [];
    const records = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
    
    if (!Array.isArray(records)) {
      throw new Error('Unexpected response format for attendance history');
    }

    return records;
  } catch (err) {
    throw err;
  }
};

// Constants for hard-coded values
const TEXT = {
  en: {
    noHistoryMessage: "No attendance history available.",
    attendanceHistoryTitle: "Attendance History",
    recentRecordsSubtitle: "Recent attendance records",
    tableHeaders: {
      DATE: "Date",
      CHECK_IN: "Check In",
      CHECK_OUT: "Check Out",
      WORKING_HOURS: "Working Hours",
      STATUS: "Status"
    },
    naValue: "N/A",
    statusValues: {
      PRESENT: 'PRESENT',
      ABSENT: 'Absent',
      DAY_OFF: 'DAY_OFF',
      HOLIDAY: 'HOLIDAY'
    },
    showingRecordsMessage: "Showing {numberOfElements} of {totalElements} records",
    loadingAttendance: "Loading attendance...",
    unableToLoad: "Unable to load attendance history."
  },
  ar: {
    noHistoryMessage: "لا توجد سجلات حضور متاحة.",
    attendanceHistoryTitle: "سجل الحضور",
    recentRecordsSubtitle: "السجلات الحديثة للحضور",
    tableHeaders: {
      DATE: "التاريخ",
      CHECK_IN: "وقت الدخول",
      CHECK_OUT: "وقت الخروج",
      WORKING_HOURS: "ساعات العمل",
      STATUS: "الحالة"
    },
    naValue: "غير متوفر",
    statusValues: {
      PRESENT: 'حاضر',
      ABSENT: 'غائب',
      DAY_OFF: 'عطلة',
      HOLIDAY: 'عطلة رسمية'
    },
    showingRecordsMessage: "عرض {numberOfElements} من {totalElements} سجل",
    loadingAttendance: "جارٍ تحميل الحضور...",
    unableToLoad: "تعذر تحميل سجل الحضور."
  }
};

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

const getDisplayStatus = (status) => {
  const norm = normalizeStatus(status);
  if (norm === 'ABSENT') return _t('ABSENT');
  if (norm === 'PRESENT') return _t('PRESENT');
  if (norm === 'WEEKEND') return _t('WEEKEND');
  if (norm === 'DAY_OFF') return _t('DAY_OFF');
  if (norm === 'ON_LEAVE') return _t('ON_LEAVE');
  return status;
};

// Add helper function for formatting dates
const formatDate = (dateStr, lang) => {
  const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
  
  if (lang === 'ar') {
    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    const dayName = arabicDays[d.getDay()];
    const monthName = arabicMonths[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    
    return `${dayName}، ${day} ${monthName} ${year}`;
  } else {
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export default function EmployeeAttendanceHistory({ empCode }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAttendanceRecords(empCode);
        if (!mounted) return;
        setHistoryData({
          content: Array.isArray(data) ? data : [],
          totalPages: 1,
          numberOfElements: Array.isArray(data) ? data.length : 0,
          totalElements: Array.isArray(data) ? data.length : 0
        });
      } catch (err) {
        if (!mounted) return;
        setError('Unable to load attendance history.');
        setHistoryData({
          content: [],
          totalPages: 0,
          numberOfElements: 0,
          totalElements: 0
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [empCode]);

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto" />
          <div className="mt-3">{copy.loadingAttendance}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-red-600">{copy.unableToLoad}</div>
      </div>
    );
  }

  if (!historyData || !historyData.content || historyData.content.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">{copy.noHistoryMessage}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {copy.attendanceHistoryTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{copy.recentRecordsSubtitle}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.tableHeaders.DATE}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.tableHeaders.CHECK_IN}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.tableHeaders.CHECK_OUT}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.tableHeaders.WORKING_HOURS}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.tableHeaders.STATUS}</th>
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

              return (
                <tr key={record.attendanceId || index} className={`border-b border-slate-100 transition-colors ${
                  isSpecialStatus ? (isAbsent ? 'bg-red-50' : 'bg-green-50') : 'hover:bg-slate-50'
                }`}>
                  <td className="py-4 px-4 text-slate-800 font-medium">
                    {formatDate(record.day || '', lang)}
                  </td>

                  {isSpecialStatus ? (
                    <td colSpan={4} className="py-4 px-4 text-center">
                      <div className={`text-xl font-semibold ${isAbsent ? 'text-red-600' : 'text-green-600'}`}>
                        {getDisplayStatus(record.status)}
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {record.checkIn || copy.naValue}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          {record.checkOut || copy.naValue}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {record.workingHours || copy.naValue}
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {getDisplayStatus(record.status)}
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
          {copy.showingRecordsMessage.replace('{numberOfElements}', historyData.numberOfElements).replace('{totalElements}', historyData.totalElements)}
        </div>
      )}
    </div>
  );
}