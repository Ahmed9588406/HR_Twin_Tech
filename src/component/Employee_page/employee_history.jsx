import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function EmployeeAttendanceHistory({ historyData }) {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">{_t('NO_HISTORY')}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {_t('HISTORY_TITLE')}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{_t('RECENT_RECORDS')}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{_t('DATE')}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{_t('CHECK_IN')}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{_t('CHECK_OUT')}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{_t('WORKING_HOURS')}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">{_t('STATUS')}</th>
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
                      return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
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
                          {record.checkIn || _t('NA')}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          {record.checkOut || _t('NA')}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {record.workingHours || _t('NA')}
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
          {_t('SHOWING_RECORDS', { n: historyData.numberOfElements, total: historyData.totalElements })}
        </div>
      )}
    </div>
  );
}
