import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOvertimeRequests } from './requests_api';
import { t as _t } from '../../i18n/i18n';

export default function OvertimeRequestsTable() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse ISO 8601 duration format (PT2H30M) to hours
  const parseDuration = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    return hours + (minutes / 60);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchOvertimeRequests();
        console.log('Overtime requests data:', data);
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load overtime requests:', err);
        setError(_t('FAILED_LOAD_OVERTIME_REQUESTS'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto" />
          <p className="mt-3 text-gray-600">{_t('LOADING_OVERTIME_REQUESTS')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('DATE')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('HOURS')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('AMOUNT')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('STATUS')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">{_t('COMMENT')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => {
                const duration = parseDuration(req.overTimeDuration);
                const amount = req.overTimeAmount || req.overtimeAmount || 0;
                
                return (
                  <tr
                    key={req.requestId}
                    role="button"
                    tabIndex={0}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/employee-profile', { state: { requestId: req.requestId } })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/employee-profile', { state: { requestId: req.requestId } });
                      }
                    }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            req.empDetails?.data
                              ? `data:${req.empDetails.contentType};base64,${req.empDetails.data}`
                              : 'https://i.pravatar.cc/150?img=12'
                          }
                          alt={req.empDetails?.empName || 'Employee'}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <span className="font-medium text-gray-900">{req.empDetails?.empName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">{req.requestDate || req.date || '-'}</td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      {duration > 0 ? `${duration.toFixed(2)} ${_t('HOURS')}` : (req.hours ?? req.overtimeHours ?? '-')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-green-600">
                        {amount > 0 ? `${amount.toFixed(2)} ${_t('CURRENCY')}` : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.requestStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : req.requestStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {req.requestStatus === 'APPROVED' ? _t('APPROVED') : req.requestStatus === 'PENDING' ? _t('PENDING') : _t('REJECTED')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">{req.comment || '-'}</td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {_t('NO_OVERTIME_REQUESTS')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
