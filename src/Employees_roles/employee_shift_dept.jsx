import React, { useState, useEffect } from 'react';
import { getLang as _getLang, subscribe as _subscribe, t as _t } from '../i18n/i18n';

const TEXT = {
  en: {
    shiftDeptTitle: 'Shift & Department Info',
    loadingShiftDept: 'Loading shift/dept info...',
    department: 'Department',
    shift: 'Shift',
    position: 'Position',
    branch: 'Branch',
    warnings: 'Warnings'
  },
  ar: {
    shiftDeptTitle: 'معلومات الوردية والقسم',
    loadingShiftDept: 'جارٍ تحميل معلومات الوردية/القسم...',
    department: 'القسم',
    shift: 'الوردية',
    position: 'المنصب',
    branch: 'الفرع',
    warnings: 'التحذيرات'
  }
};

const EmployeeShiftDept = () => {
  const [data, setData] = useState(null);
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
    const fetchShiftDeptData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Auth token not found; please log in again.');
        }

        const url = `https://api.shl-hr.com/api/v1/emp-dashboard/employee-shift-dept`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

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
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftDeptData();
  }, []);

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
                <p className="font-bold text-gray-800">{data?.departmentName || 'N/A'}</p>
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
                <p className="font-bold text-gray-800">{data?.shiftName && data?.shiftTime ? `${data.shiftName} (${data.shiftTime})` : 'N/A'}</p>
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
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-lime-600 uppercase tracking-wide mb-1">{copy.branch}</p>
                <p className="font-bold text-gray-800">{data?.branchName || 'N/A'}</p>
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
                  <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">{copy.warnings}</p>
                  <p className="text-sm text-gray-800">{_t('TERMINATION_WARNINGS', { n: String(data.noticeNumber) })}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeShiftDept;
