import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchRequestById, approveVacationRequest, rejectVacationRequest } from './requests_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';
import RequestDetailsSection from './RequestDetailsSection';

export default function VacationRequestPage() {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  const location = useLocation();
  const navigate = useNavigate();
  const { requestId } = location.state || {};
  const [requestData, setRequestData] = useState(null);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [isPaid, setIsPaid] = useState(true);

  useEffect(() => {
    const loadRequestData = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchRequestById(requestId);
        setRequestData(data);
        // Normalize the status to uppercase for consistency
        const normalizedStatus = (data.requestStatus || 'PENDING').toUpperCase();
        setStatus(normalizedStatus);
      } catch (err) {
        console.error('Failed to fetch request data:', err);
        setError('Failed to load request data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRequestData();
  }, [requestId]);

  const handleAccept = async () => {
    if (!requestId) return;
    const prevStatus = status;
    try {
      setApproving(true);
      setStatus('APPROVING...');
      // Call approve API with the selected paid status
      const result = await approveVacationRequest(requestId, isPaid);
      console.log('Approve result:', result);
      setStatus('APPROVED');
      // Refresh request data to reflect server state
      try {
        const fresh = await fetchRequestById(requestId);
        setRequestData(fresh);
        const normalizedStatus = (fresh.requestStatus || 'APPROVED').toUpperCase();
        setStatus(normalizedStatus);
      } catch (refreshErr) {
        console.warn('Failed to refresh request after approve:', refreshErr);
      }
    } catch (err) {
      console.error('Approve failed:', err);
      alert(_t('FAILED_TO_APPROVE') + ': ' + (err.message || 'Please try again.'));
      setStatus(prevStatus || 'PENDING');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!requestId) return;
    const prevStatus = status;
    try {
      setRejecting(true);
      setStatus('REJECTING...');
      // Call reject API
      const result = await rejectVacationRequest(requestId);
      console.log('Reject result:', result);
      setStatus('REJECTED');
      // Refresh request data
      try {
        const fresh = await fetchRequestById(requestId);
        setRequestData(fresh);
        const normalizedStatus = (fresh.requestStatus || 'REJECTED').toUpperCase();
        setStatus(normalizedStatus);
      } catch (refreshErr) {
        console.warn('Failed to refresh request after reject:', refreshErr);
      }
    } catch (err) {
      console.error('Reject failed:', err);
      alert(_t('FAILED_TO_REJECT') + ': ' + (err.message || 'Please try again.'));
      setStatus(prevStatus || 'PENDING');
    } finally {
      setRejecting(false);
    }
  };
  const handleBack = () => navigate(-1);

  // Function to navigate through proxy and download file with Authorization header
  const downloadFile = async (fileUrl) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Auth token not found; please log in again.');
        return;
      }

      // Turn absolute ngrok URL into relative path for the dev proxy
      // e.g. https://api.shl-hr.com/api/v1/requests/download?path=...
      // -> /api/v1/requests/download?path=...
      const relativeUrl = fileUrl.replace(/^https?:\/\/[^/]+/, '');

      // Build a URL object to extract filename (from query param 'path' or pathname)
      const urlForParsing = new URL(relativeUrl, window.location.origin);
      const pathParam = urlForParsing.searchParams.get('path');
      const fileName = pathParam ? pathParam.split('/').pop() : (urlForParsing.pathname.split('/').pop() || 'document');

      const resp = await fetch(relativeUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`Failed to fetch file: ${resp.status} ${resp.statusText} ${text}`);
      }

      const blob = await resp.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file. ' + (err.message || ''));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING_REQUEST')}</p>
        </div>
      </div>
    );
  }

  if (!requestId || !requestData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{_t('NO_REQUEST_DATA')}</h2>
          <p className="text-gray-600 mb-4">{error || 'No request information available.'}</p>
          <button
            onClick={() => navigate('/req-dashboard')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {_t('GO_TO_REQ_DASH')}
          </button>
        </div>
      </div>
    );
  }

  const employee = requestData.empDetails;

  // helper to map runtime status to translation key
  const statusToKey = (s) => {
    const norm = String(s || '').toUpperCase().trim();
    if (norm === 'APPROVED' || /AP?PROV|APROV|APPROV|APPROVED|APROVED|ACCEPT/.test(norm)) return 'APPROVED';
    if (norm === 'REJECTED' || /REJ|REJECT/.test(norm)) return 'REJECTED';
    if (norm === 'PENDING' || /PEND/.test(norm)) return 'PENDING';
    if (norm === 'APPROVING...' || /APPROVING/.test(norm)) return 'APPROVING';
    if (norm === 'REJECTING...' || /REJECTING/.test(norm)) return 'REJECTING';
    return norm || '-';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{_t('BACK')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 h-32"></div>
              <div className="px-6 pb-6 -mt-16">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={employee.data ? `data:${employee.contentType};base64,${employee.data}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
                      alt={employee.empName}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${employee.empStatus === 'USER' ? 'bg-green-500' : 'bg-yellow-500'
                      } animate-pulse`}></div>
                  </div>

                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{employee.empName}</h2>
                    <p className="text-green-600 font-medium mt-1">{employee.empPosition}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {employee.empDepartment}
                    </span>
                  </div>

                  <div className="mt-6 w-full">
                    <div className="border rounded-lg py-3 text-center bg-green-50 border-green-200">
                      <span className="font-semibold text-green-700">{_t('ACTIVE_EMPLOYEE')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{_t('REQUEST_STATUS')}</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status === 'PENDING' || status === 'APPROVING...' || status === 'REJECTING...' ? 'bg-yellow-100 text-yellow-700' :
                    status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                  }`}>
                  {_t(statusToKey(status))}
                </span>
              </div>

              {status === 'PENDING' && (
                <div className="space-y-4">
                  {/* Paid/Unpaid Toggle */}
                  <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className={`font-medium ${!isPaid ? 'text-gray-900' : 'text-gray-500'}`}>
                        {_t('UNPAID_VACATION') || 'Unpaid'}
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isPaid}
                          onChange={(e) => setIsPaid(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                      </div>
                      <span className={`font-medium ${isPaid ? 'text-gray-900' : 'text-gray-500'}`}>
                        {_t('PAID_VACATION') || 'Paid'}
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleReject}
                      disabled={rejecting || approving}
                      className={`flex-1 ${rejecting || approving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                    >
                      {rejecting ? _t('REJECTING') || 'Rejecting...' : _t('REJECT') || 'Reject'}
                    </button>
                    <button
                      onClick={handleAccept}
                      disabled={approving || rejecting}
                      className={`flex-1 ${approving || rejecting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                    >
                      {approving ? _t('APPROVING') || 'Approving...' : _t('ACCEPT') || 'Accept'}
                    </button>
                  </div>
                </div>
              )}

              {status === 'APPROVED' && (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-4 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">{_t('REQUEST_APPROVED')}</span>
                </div>
              )}

              {status === 'REJECTED' && (
                <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 py-4 rounded-xl">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">{_t('REQUEST_REJECTED')}</span>
                </div>
              )}
            </div>

            {/* Request Details Card - Dynamic based on request type */}
            <RequestDetailsSection requestData={requestData} downloadFile={downloadFile} />
          </div>
        </div>

        
      </div>
    </div>
  );
}