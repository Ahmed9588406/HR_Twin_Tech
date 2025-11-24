import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdvanceRequests } from './requests_api';
import { t as _t } from '../../i18n/i18n';

export default function AdvanceRequestsTable() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdvanceRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load advance requests:', err);
        setError(_t('FAILED_LOAD_ADVANCE_REQUESTS'));
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
          <p className="mt-3 text-gray-600">{_t('LOADING_ADVANCE_REQUESTS')}</p>
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('REQUEST_DATE')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('AMOUNT')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('PAYMENT_DATE')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('STATUS')}</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">{_t('COMMENT')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
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
                  <td className="py-4 px-4 text-gray-600">{req.requestDate}</td>
                  <td className="py-4 px-4 text-gray-600">{req.advanceAmount?.toFixed?.(2) ?? req.advanceAmount} EGP</td>
                  <td className="py-4 px-4 text-gray-600">{req.paymentDate || '-'}</td>
                  <td className="py-4 px-4">
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
                  <td className="py-4 px-4 text-gray-600">{req.comment}</td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {_t('NO_ADVANCE_REQUESTS')}
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
