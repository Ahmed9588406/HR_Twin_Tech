import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVacationRequests } from './requests_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function VacationRequestsTable() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(_getLang());

  useEffect(() => {
    const loadVacationRequests = async () => {
      try {
        setLoading(true);
        const data = await fetchVacationRequests();
        setRequests(data || []);
      } catch (err) {
        console.error('API fetch failed:', err);
        setError(_t('FAILED_LOAD_VACATION_REQUESTS'));
      } finally {
        setLoading(false);
      }
    };

    loadVacationRequests();
  }, []);

  useEffect(() => {
    const unsub = _subscribe(setLang);
    return () => unsub();
  }, []);

  const toProfileEmployee = (request) => ({
    name: request.empDetails.empName,
    code: request.empDetails.empCode,
    role: request.empDetails.empPosition,
    department: request.empDetails.empDepartment,
    avatar: request.empDetails.data
      ? `data:${request.empDetails.contentType};base64,${request.empDetails.data}`
      : 'https://i.pravatar.cc/150?img=12',
    checkInTime: 'N/A',
    status:
      request.requestStatus === 'APPROVED'
        ? 'Approved'
        : request.requestStatus === 'PENDING'
        ? 'Pending'
        : 'Rejected',
    requestDate: request.requestDate,
    startDate: request.startDate,
    endDate: request.endDate,
    comment: request.comment,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING_VACATION_REQUESTS')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{_t('ERROR_LOADING_DATA')}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vacation Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('REQUEST_DATE')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('START_DATE')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('END_DATE')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('STATUS')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('COMMENT')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr
                  key={request.requestId}
                  role="button"
                  tabIndex={0}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate('/employee-profile', { state: { requestId: request.requestId } })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/employee-profile', { state: { requestId: request.requestId } });
                    }
                  }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          request.empDetails.data
                            ? `data:${request.empDetails.contentType};base64,${request.empDetails.data}`
                            : 'https://i.pravatar.cc/150?img=12'
                        }
                        alt={request.empDetails.empName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <span className="font-medium text-gray-900">{request.empDetails.empName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.requestDate}</td>
                  <td className="py-4 px-4 text-gray-600">{request.startDate}</td>
                  <td className="py-4 px-4 text-gray-600">{request.endDate}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.requestStatus === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : request.requestStatus === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.requestStatus === 'APPROVED' ? _t('APPROVED') : request.requestStatus === 'PENDING' ? _t('PENDING') : _t('REJECTED')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.comment}</td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {_t('NO_VACATION_REQUESTS') === 'NO_VACATION_REQUESTS'
                      ? (lang === 'ar' ? 'لا توجد طلبات إجازة' : 'No vacation requests')
                      : _t('NO_VACATION_REQUESTS')}
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
