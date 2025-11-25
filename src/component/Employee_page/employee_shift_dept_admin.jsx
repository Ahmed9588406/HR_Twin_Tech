import React, { useState, useEffect } from 'react';
import { Edit, X, Check } from 'lucide-react';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

const TEXT = {
  en: {
    shiftDeptTitle: 'Shift & Department Info',
    loadingShiftDept: 'Loading shift/dept info...',
    department: 'Department',
    shift: 'Shift',
    position: 'Position',
    branch: 'Branch',
    warnings: 'Warnings',
    editWarnings: 'Edit Warnings',
    enterNewWarnings: 'Enter new number of warnings:',
    invalidNumber: 'Please enter a valid number.',
    warningsUpdated: 'Warnings updated successfully.',
    updateError: 'Failed to update warnings.',
    save: 'Save',
    cancel: 'Cancel',
    editWarningsTitle: 'Edit Warnings',
    limitExceeded: 'Cannot set warnings: company limit exceeded.'
  },
  ar: {
    shiftDeptTitle: 'معلومات الوردية والقسم',
    loadingShiftDept: 'جارٍ تحميل معلومات الوردية/القسم...',
    department: 'القسم',
    shift: 'الوردية',
    position: 'المنصب',
    branch: 'الفرع',
    warnings: 'التحذيرات',
    editWarnings: 'تحرير التحذيرات',
    enterNewWarnings: 'أدخل عدد التحذيرات الجديد:',
    invalidNumber: 'يرجى إدخال رقم صحيح.',
    warningsUpdated: 'تم تحديث التحذيرات بنجاح.',
    updateError: 'فشل في تحديث التحذيرات.',
    save: 'حفظ',
    cancel: 'إلغاء',
    editWarningsTitle: 'تحرير التحذيرات',
    limitExceeded: 'لا يمكن تعيين هذا العدد من التحذيرات: تجاوز الحد المسموح به في الشركة.'
  }
};

const EmployeeShiftDept = ({ empCode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newWarnings, setNewWarnings] = useState('');

  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const fetchShiftDeptData = async () => {
      if (!empCode) {
        setError('Employee code not available');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Auth token not found; please log in again.');
        }

        const url = `https://api.shl-hr.com/api/v1/dashboard/${empCode}/details`;
        console.log('[DEBUG] Fetching shift/dept data from URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('[DEBUG] Response status:', response.status);

        if (!response.ok) {
          let errorMessage = 'Failed to fetch shift/dept data';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = `${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('[DEBUG] Shift/Dept data:', result);

        // Transform the API response to match the expected format
        const transformedData = {
          department: result.departmentName || 'N/A',
          shift: result.shiftName && result.shiftTime ? `${result.shiftName} (${result.shiftTime})` : 'N/A',
          jobPosition: result.jobPosition || 'N/A',
          branch: result.branchName || 'N/A',
          noticeNumber: result.noticeNumber || 0,
        };

        setData(transformedData);

        // Remove warnings state as we use noticeNumber directly
      } catch (err) {
        console.error('[DEBUG] Error fetching shift/dept data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftDeptData();
  }, [empCode]);

  const handleEditWarnings = () => {
    setNewWarnings(data.noticeNumber.toString());
    setShowEditModal(true);
  };

  const handleSaveWarnings = async () => {
    const num = parseInt(newWarnings, 10);
    if (isNaN(num) || num < 0) {
      alert(copy.invalidNumber);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Auth token not found; please log in again.');
      }

      const response = await fetch(
        `https://api.shl-hr.com/api/v1/employees/num-edit-termination-notice/${empCode}/${num}`,
        {
          method: 'PUT',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ noticeNumber: num })
        }
      );

      const text = await response.text().catch(() => '');
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }

      if (!response.ok) {
        // Handle specific server error codes (e.g. LIMIT_EXCEEDED)
        if (json && json.code === 'LIMIT_EXCEEDED') {
          const serverMsg = json.message || '';
          alert(`${copy.limitExceeded}${serverMsg ? ' — ' + serverMsg : ''}`);
          return;
        }
        const body = text || response.statusText;
        throw new Error(`Failed to update warnings: ${response.status} - ${body}`);
      }

      // Interpret success response (boolean or object)
      const success =
        json === true ||
        json === 'true' ||
        (typeof json === 'object' && (json.success === true || json.updated === true)) ||
        response.status === 200;

      if (!success) {
        // If server returned some message, show it; otherwise generic error
        const srvMsg = (json && (json.message || JSON.stringify(json))) || text || '';
        throw new Error(srvMsg || 'Unexpected server response');
      }

      setData(prev => ({ ...prev, noticeNumber: num }));
      alert(copy.warningsUpdated);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating warnings:', error);
      alert(`${copy.updateError}${error && error.message ? ' - ' + error.message : ''}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto" />
          <p className="mt-2 text-gray-600">{copy.loadingShiftDept}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-slate-200">
        <p className="text-red-500 text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 mt-6" dir={dir} lang={lang}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          {copy.shiftDeptTitle}
        </h3>
        <div className="space-y-4">
          {/* Department */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">{copy.department}</p>
                <p className="font-bold text-gray-800">{data?.department || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shift */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">{copy.shift}</p>
                <p className="font-bold text-gray-800">{data?.shift || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">{copy.position}</p>
                <p className="font-bold text-gray-800">{data?.jobPosition || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Branch */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl border-2 border-lime-100 hover:border-lime-300 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-lime-600 uppercase tracking-wide mb-1">{copy.branch}</p>
                <p className="font-bold text-gray-800">{data?.branch || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          {data?.noticeNumber > 0 && (
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-red-600 uppercase tracking-wide">{copy.warnings}</p>
                    <button
                      onClick={handleEditWarnings}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      aria-label={copy.editWarnings}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-800">You have {data.noticeNumber} warning(s).</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Warnings Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{copy.editWarningsTitle}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {copy.enterNewWarnings}
                </label>
                <input
                  type="number"
                  value={newWarnings}
                  onChange={(e) => setNewWarnings(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copy.cancel}
                </button>
                <button
                  onClick={handleSaveWarnings}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  {copy.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeShiftDept;
