import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, AlertCircle, Edit, Send, Trash2, Lock, Calendar, Clock, DollarSign, MessageSquare, CheckCircle } from 'lucide-react';
import { fetchRequestById, approveVacationRequest, rejectVacationRequest } from './requests_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

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
      // Call approve API with paid=true
      const result = await approveVacationRequest(requestId, true);
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

  // Calculate duration in days
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

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
  const duration = calculateDuration(requestData.startDate, requestData.endDate);

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
                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                      employee.empStatus === 'USER' ? 'bg-green-500' : 'bg-yellow-500'
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
                      <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      <span className="font-semibold text-green-700">{_t('ACTIVE_EMPLOYEE')}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <button className="p-3 bg-green-50 hover:bg-green-100 rounded-full transition-colors">
                      <Phone className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-3 bg-green-50 hover:bg-green-100 rounded-full transition-colors">
                      <AlertCircle className="w-5 h-5 text-green-600" />
                    </button>
                  </div>

                  <div className="mt-6 flex justify-center gap-3 pt-6 border-t border-gray-200 w-full">
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Send className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5 text-green-600" />
                    </button>
                    <button className="p-2.5 hover:bg-green-50 rounded-lg transition-colors">
                      <Lock className="w-5 h-5 text-green-600" />
                    </button>
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
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  status === 'PENDING' || status === 'APPROVING...' || status === 'REJECTING...' ? 'bg-yellow-100 text-yellow-700' :
                  status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {_t(statusToKey(status))}
                </span>
              </div>
              
              {status === 'PENDING' && (
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

            {/* Request Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{_t('REQUEST_DETAILS')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('REQUEST_TYPE')}</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium capitalize">{requestData.requestType}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('REQUEST_DATE')}</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">{requestData.requestDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('START_DATE')}</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">{requestData.startDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('END_DATE')}</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <span className="text-gray-900 font-medium">{requestData.endDate}</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-semibold">{_t('DURATION')}: {duration} {_t('DAYS')}</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {_t('COMMENT')}
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">{requestData.comment || _t('NO_COMMENT')}</p>
                  </div>
                </div>

                {/* File Paths */}
                {requestData.filePaths && requestData.filePaths.length > 0 && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('ATTACHED_FILES')}</label>
                    <div className="space-y-2">
                      {requestData.filePaths.map((filePath, index) => (
                        <button
                          key={index}
                          onClick={() => downloadFile(filePath)}
                          className="block bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg p-3 transition-colors font-medium text-left w-full"
                        >
                          📎 {_t('DOWNLOAD_DOC')} {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                {_t('FINANCIAL_DETAILS')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('OVERTIME_MINS')}</label>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('ADVANCE_AMOUNT')}</label>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{_t('OVERTIME_AMOUNT')}</label>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                </div>

                <div className="md:col-span-3 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{_t('PAID_FROM_COMPANY')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <span>2025 © TwinTech - SHL HR.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}