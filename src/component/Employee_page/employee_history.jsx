import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

const TEXT = {
  en: {
    noHistory: 'No attendance history available.',
    historyTitle: 'Attendance History',
    recentRecords: 'Recent attendance records',
    date: 'Date',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    workingHours: 'Working Hours',
    status: 'Status',
    na: 'N/A',
    showingRecords: 'Showing {n} of {total} records'
  },
  ar: {
    noHistory: 'لا توجد سجلات حضور متاحة.',
    historyTitle: 'سجل الحضور',
    recentRecords: 'السجلات الحديثة للحضور',
    date: 'التاريخ',
    checkIn: 'وقت الدخول',
    checkOut: 'وقت الخروج',
    workingHours: 'ساعات العمل',
    status: 'الحالة',
    na: 'غير متوفر',
    showingRecords: 'عرض {n} من {total} سجل'
  }
};

export default function EmployeeAttendanceHistory({ historyData }) {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const normalizeStatus = (raw) => {
    if (!raw) return 'OTHER';
    const s = String(raw).trim().toUpperCase();
    if (s === 'APSENT' || s === 'APESENT' || s === 'ABSENT' || s === 'ABSENTED') return 'ABSENT';
    if (s.includes('PRESENT')) return 'PRESENT';
    if (s.includes('WEEKEND')) return 'WEEKEND';
    if (s.includes('HOLIDAY') || s.includes('DAY_OFF') || s.includes('DAY-OFF')) return 'DAY_OFF';
    if (s.includes('LEAVE') || s.includes('ON_LEAVE')) return 'ON_LEAVE';
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

  const getStatusIcon = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'PRESENT': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ABSENT': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'PRESENT': return 'text-green-700 bg-green-50';
      case 'ABSENT': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  if (!historyData || !historyData.content || historyData.content.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
        <div className="text-center text-gray-500">{copy.noHistory}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {copy.historyTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{copy.recentRecords}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.date}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.checkIn}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.checkOut}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.workingHours}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{copy.status}</th>
            </tr>
          </thead>
          <tbody>
            {historyData.content.map((record, index) => {
              const normStatus = normalizeStatus(record.status);
              const isSpecialStatus = ['ABSENT', 'DAY_OFF', 'WEEKEND', 'ON_LEAVE'].includes(normStatus);

              return (
                <tr key={record.attendanceId || index} className={`border-b border-slate-100 transition-colors ${
                  isSpecialStatus ? (normStatus === 'ABSENT' ? 'bg-red-50' : 'bg-green-50') : 'hover:bg-slate-50'
                }`}>
                  <td className="py-4 px-4 text-slate-800 font-medium">
                    {(() => {
                      const dayStr = record.day || '';
                      const d = new Date(dayStr.includes('T') ? dayStr : `${dayStr}T00:00:00`);
                      return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                    })()}
                  </td>

                  {isSpecialStatus ? (
                    <td colSpan={4} className="py-4 px-4 text-center">
                      <div className={`text-xl font-semibold ${normStatus === 'ABSENT' ? 'text-red-600' : 'text-green-600'}`}>
                        {getDisplayStatus(record.status)}
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {record.checkIn || copy.na}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          {record.checkOut || copy.na}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {record.workingHours || copy.na}
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
          {copy.showingRecords.replace('{n}', historyData.numberOfElements).replace('{total}', historyData.totalElements)}
        </div>
      )}
    </div>
  );
}
