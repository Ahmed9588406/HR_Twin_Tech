import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdvanceLogs, fetchOvertimeLogs, fetchVacationLogs } from './requests_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function usePaginated(data, pageSize = 10) {
  const [page, setPage] = useState(1);
  const total = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = useMemo(() => (Array.isArray(data) ? data.slice(start, end) : []), [data, start, end]);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const reset = () => setPage(1);

  useEffect(() => {
    // whenever data array changes size, reset to first page
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return { page: currentPage, totalPages, pageItems, total, next, prev };
}

function Pagination({ page, totalPages, onPrev, onNext }) {
  const lang = _getLang();
  const isRtlLocal = lang === 'ar';

  const pageLabel = `${_t('PAGE') || 'Page'} ${page + 1} ${_t('OF') || 'of'} ${totalPages}`;
  const prevLabel = _t('PREVIOUS') || 'Previous';
  const nextLabel = _t('NEXT') || 'Next';

  const PrevButton = (
    <button
      onClick={onPrev}
      disabled={page <= 0}
      aria-label={prevLabel}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border ${page <= 0 ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
    >
      <ChevronLeft className="w-4 h-4" /> {prevLabel}
    </button>
  );

  const NextButton = (
    <button
      onClick={onNext}
      disabled={page >= totalPages - 1}
      aria-label={nextLabel}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border ${page >= totalPages - 1 ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
    >
      {nextLabel} <ChevronRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
      <span className="text-sm text-gray-600">{pageLabel}</span>
      <div className="flex items-center gap-2">
        {isRtlLocal ? (<>{NextButton}{PrevButton}</>) : (<>{PrevButton}{NextButton}</>)}
      </div>
    </div>
  );
}

// Add helper to normalize status and map to classes
const getStatusMeta = (raw) => {
  const s = String(raw || '').toUpperCase().trim();
  // Match common variants and typos (e.g. 'APROVED', 'APPROVED', 'accepted')
  if (/AP?PROV|APROV|APPROV|APPROVED|APROVED|ACCEPT/.test(s)) {
    return { statusKey: 'APPROVED', className: 'bg-green-100 text-green-700' };
  }
  if (/PEND/.test(s)) {
    return { statusKey: 'PENDING', className: 'bg-yellow-100 text-yellow-800' };
  }
  if (/REJ|REJECT/.test(s)) {
    return { statusKey: 'REJECTED', className: 'bg-red-100 text-red-800' };
  }
  // fallback: show trimmed original (or dash) with neutral styling
  return { statusKey: s || '-', className: 'bg-gray-100 text-gray-700' };
};

export default function RequestsLogs() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  const PAGE_SIZE = 5;

  // Vacation (server-side pagination)
  const [vacItems, setVacItems] = useState([]);
  const [vacPage, setVacPage] = useState(0);
  const [vacTotalPages, setVacTotalPages] = useState(1);
  const [vacLoading, setVacLoading] = useState(true);
  const [vacError, setVacError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setVacLoading(true);
        const res = await fetchVacationLogs(vacPage, PAGE_SIZE);
        if (!mounted) return;
        setVacItems(Array.isArray(res.items) ? res.items : []);
        setVacTotalPages(res.totalPages || 1);
      } catch (e) {
        if (!mounted) return;
        setVacError(_t('FAILED_LOAD_VACATION_REQUESTS') || 'Failed to load vacation requests');
      } finally {
        if (!mounted) return;
        setVacLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [vacPage]);

  // Advance (server-side pagination)
  const [advItems, setAdvItems] = useState([]);
  const [advPage, setAdvPage] = useState(0);
  const [advTotalPages, setAdvTotalPages] = useState(1);
  const [advLoading, setAdvLoading] = useState(true);
  const [advError, setAdvError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setAdvLoading(true);
        const res = await fetchAdvanceLogs(advPage, PAGE_SIZE);
        if (!mounted) return;
        setAdvItems(Array.isArray(res.items) ? res.items : []);
        setAdvTotalPages(res.totalPages || 1);
      } catch (e) {
        if (!mounted) return;
        setAdvError(_t('FAILED_LOAD_ADVANCE_REQUESTS') || 'Failed to load advance requests');
      } finally {
        if (!mounted) return;
        setAdvLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [advPage]);

  // Overtime (server-side pagination)
  const [ovtItems, setOvtItems] = useState([]);
  const [ovtPage, setOvtPage] = useState(0);
  const [ovtTotalPages, setOvtTotalPages] = useState(1);
  const [ovtLoading, setOvtLoading] = useState(true);
  const [ovtError, setOvtError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setOvtLoading(true);
        const res = await fetchOvertimeLogs(ovtPage, PAGE_SIZE);
        if (!mounted) return;
        setOvtItems(Array.isArray(res.items) ? res.items : []);
        setOvtTotalPages(res.totalPages || 1);
      } catch (e) {
        if (!mounted) return;
        setOvtError(_t('FAILED_LOAD_OVERTIME_REQUESTS') || 'Failed to load overtime requests');
      } finally {
        if (!mounted) return;
        setOvtLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [ovtPage]);

  const isRtl = lang === 'ar';

  return (
    <div className={`space-y-10`} dir={isRtl ? 'rtl' : 'ltr'} lang={lang}>
      {/* Vacation table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">{_t('REQUESTS_VACATION') || 'Vacation Request'}</h2>
        </div>
        {vacLoading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto" />
            <p className="mt-3 text-gray-600">{_t('LOADING_VACATION_REQUESTS') || 'Loading vacation requests...'}</p>
          </div>
        ) : vacError ? (
          <div className="p-6 text-red-600">{vacError}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL') || 'Employee'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('REQUEST_DATE') || 'Request Date'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('START_DATE') || 'Start Date'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('END_DATE') || 'End Date'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('STATUS') || 'Status'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('COMMENT') || 'Comment'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vacItems.map((request) => {
                    const { statusKey, className: statusClass } = getStatusMeta(request.requestStatus);
                    return (
                      <tr
                        key={request.requestId}
                        role="button"
                        tabIndex={0}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate('/employee-profile', { state: { requestId: request.requestId } })}
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
                              src={request.empDetails?.data ? `data:${request.empDetails.contentType};base64,${request.empDetails.data}` : 'https://i.pravatar.cc/150?img=12'}
                              alt={request.empDetails?.empName || 'Employee'}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                            />
                            <span className="font-medium text-gray-900">{request.empDetails?.empName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{request.requestDate}</td>
                        <td className="py-4 px-4 text-gray-600">{request.startDate}</td>
                        <td className="py-4 px-4 text-gray-600">{request.endDate}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                            {_t(statusKey) || statusKey}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{request.comment}</td>
                      </tr>
                    );
                  })}
                  {vacItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">{_t('NO_VACATION_REQUESTS') || 'No vacation requests'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={vacPage}
              totalPages={vacTotalPages}
              onPrev={() => setVacPage((p) => Math.max(0, p - 1))}
              onNext={() => setVacPage((p) => Math.min(vacTotalPages - 1, p + 1))}
            />
          </>
        )}
      </div>

      {/* Advance table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">{_t('REQUESTS_ADVANCE') || 'Advance Request'}</h2>
        </div>
        {advLoading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto" />
            <p className="mt-3 text-gray-600">{_t('LOADING_ADVANCE_REQUESTS') || 'Loading advance requests...'}</p>
          </div>
        ) : advError ? (
          <div className="p-6 text-red-600">{advError}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL') || 'Employee'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('REQUEST_DATE') || 'Request Date'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('AMOUNT') || 'Amount'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('PAYMENT_DATE') || 'Payment Date'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('STATUS') || 'Status'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('COMMENT') || 'Comment'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {advItems.map((req) => {
                    const { statusKey, className: statusClass } = getStatusMeta(req.requestStatus);
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
                              src={req.empDetails?.data ? `data:${req.empDetails.contentType};base64,${req.empDetails.data}` : 'https://i.pravatar.cc/150?img=12'}
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
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                            {_t(statusKey) || statusKey}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{req.comment}</td>
                      </tr>
                    );
                  })}
                  {advItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">{_t('NO_ADVANCE_REQUESTS') || 'No advance requests'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={advPage}
              totalPages={advTotalPages}
              onPrev={() => setAdvPage((p) => Math.max(0, p - 1))}
              onNext={() => setAdvPage((p) => Math.min(advTotalPages - 1, p + 1))}
            />
          </>
        )}
      </div>

      {/* Overtime table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">{_t('REQUESTS_OVERTIME') || 'Over Time'}</h2>
        </div>
        {ovtLoading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto" />
            <p className="mt-3 text-gray-600">{_t('LOADING_OVERTIME_REQUESTS') || 'Loading overtime requests...'}</p>
          </div>
        ) : ovtError ? (
          <div className="p-6 text-red-600">{ovtError}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700">{_t('EMPLOYEE_COL') || 'Employee'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('DATE') || 'Date'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('HOURS') || 'Hours'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('STATUS') || 'Status'}</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-700">{_t('COMMENT') || 'Comment'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ovtItems.map((req) => {
                    const { statusKey, className: statusClass } = getStatusMeta(req.requestStatus);
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
                              src={req.empDetails?.data ? `data:${req.empDetails.contentType};base64,${req.empDetails.data}` : 'https://i.pravatar.cc/150?img=12'}
                              alt={req.empDetails?.empName || 'Employee'}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                            />
                            <span className="font-medium text-gray-900">{req.empDetails?.empName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{req.requestDate || req.date || '-'}</td>
                        <td className="py-4 px-4 text-gray-600">{req.hours ?? req.overtimeHours ?? '-'}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                            {_t(statusKey) || statusKey}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{req.comment || '-'}</td>
                      </tr>
                    );
                  })}
                  {ovtItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">{_t('NO_OVERTIME_REQUESTS') || 'No overtime requests'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={ovtPage}
              totalPages={ovtTotalPages}
              onPrev={() => setOvtPage((p) => Math.max(0, p - 1))}
              onNext={() => setOvtPage((p) => Math.min(ovtTotalPages - 1, p + 1))}
            />
          </>
        )}
      </div>
    </div>
  );
}
