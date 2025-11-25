import React, { useState, useRef, useEffect } from 'react';
import { Calendar, UploadCloud, X } from 'lucide-react';
import { postVacationRequest } from './employee_role_api';
import { getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

const TEXT = {
  en: {
    modalTitle: 'Request Details',
    modalSubtitle: 'Provide the dates and type for your leave.',
    closeLabel: 'Close',
    requestDateLabel: 'Request date',
    leaveStartLabel: 'Leave start date',
    leaveEndLabel: 'Leave end date',
    leaveTypeLabel: 'Leave Type',
    annualLeave: 'Annual leave',
    sickLeave: 'Sick leave',
    uploadLabel: 'Upload File',
    noFile: 'No file chosen',
    commentsLabel: 'Comments',
    commentsPlaceholder: 'Write here...',
    cancel: 'Cancel',
    submit: 'Leave Request',
    submitting: 'Submitting...',
    validationMissingDates: 'Please provide both start and end dates.',
    validationInvalidRange: 'Start date cannot be after end date.',
    submitSuccess: 'Leave request submitted successfully.',
    submitFailureFallback: 'Failed to submit leave request. Please try again.',
    failurePrefix: 'Leave request failed:'
  },
  ar: {
    modalTitle: 'تفاصيل الطلب',
    modalSubtitle: 'يرجى إدخال تواريخ ونوع الإجازة.',
    closeLabel: 'إغلاق',
    requestDateLabel: 'تاريخ الطلب',
    leaveStartLabel: 'تاريخ بداية الإجازة',
    leaveEndLabel: 'تاريخ نهاية الإجازة',
    leaveTypeLabel: 'نوع الإجازة',
    annualLeave: 'إجازة سنوية',
    sickLeave: 'إجازة مرضية',
    uploadLabel: 'رفع ملف',
    noFile: 'لم يتم اختيار ملف',
    commentsLabel: 'ملاحظات',
    commentsPlaceholder: 'اكتب هنا...',
    cancel: 'إلغاء',
    submit: 'إرسال الطلب',
    submitting: 'جارٍ الإرسال...',
    validationMissingDates: 'يرجى إدخال تاريخي البداية والنهاية.',
    validationInvalidRange: 'لا يمكن أن يكون تاريخ البداية بعد تاريخ النهاية.',
    submitSuccess: 'تم إرسال طلب الإجازة بنجاح.',
    submitFailureFallback: 'تعذر إرسال طلب الإجازة. حاول مرة أخرى.',
    failurePrefix: 'فشل طلب الإجازة:'
  }
};

export default function VacationRequest({ employee = {}, onClose = () => {}, onSuccess = () => {} }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [comments, setComments] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestDate, setRequestDate] = useState(() => {
    // default to today in yyyy-mm-dd format
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const fileInputRef = useRef();

  // draggable state
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [useTransformCenter, setUseTransformCenter] = useState(true); // initially center via transform

  useEffect(() => {
    // lock scroll when modal open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const resetForm = () => {
    setRequestDate(new Date().toISOString().slice(0,10));
    setStartDate('');
    setEndDate('');
    setLeaveType('ANNUAL');
    setComments('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const validate = () => {
    if (!startDate || !endDate) {
      alert(copy.validationMissingDates);
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert(copy.validationInvalidRange);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        requestDate,
        startDate,
        endDate,
        leaveType, // Should be 'ANNUAL' or 'SICK'
        comment: comments
      };

      console.log('Submitting vacation request with payload:', payload);
      console.log('Employee code:', employee.code);
      console.log('File:', file ? file.name : 'No file');

      // Call helper: will send multipart FormData
      const result = await postVacationRequest(employee.code, payload, file);
      console.log('Vacation request result:', result);

      alert(copy.submitSuccess);
      resetForm();
      onSuccess();
    } catch (err) {
      console.error('Leave request failed:', err);
      // Extract friendly message if possible
      let msg = copy.submitFailureFallback;
      try {
        const m = String(err.message || err);
        // If the error message is already in Arabic or is a simple string, use it directly
        if (m && m.trim()) {
          msg = m;
        }
      } catch {}
      alert(`${copy.failurePrefix} ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Drag handlers (mouse + touch)
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const left = clientX - offset.x;
      const top = clientY - offset.y;

      // clamp to viewport so modal doesn't go fully off-screen
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = containerRef.current;
      const w = el ? el.offsetWidth : 600;
      const h = el ? el.offsetHeight : 420;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
    };

    const onUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, offset]);

  const startDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // If we're using transform centering, switch to absolute positioning before dragging
    if (useTransformCenter) {
      setPos({ left: rect.left, top: rect.top });
      setUseTransformCenter(false);
    }

    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
    // prevent text selection while dragging
    e.preventDefault();
  };

  // close handler that also resets scroll lock
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" dir={dir} lang={lang}>
      {/* container positioned either centered via transform or via absolute left/top */}
      <div
        ref={containerRef}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={
          useTransformCenter
            ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
            : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
        }
        className={`w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden cursor-auto`}
      >
        <div
          className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white flex items-center justify-between select-none cursor-grab"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div>
            <h3 className="text-lg font-semibold">{copy.modalTitle}</h3>
            <p className="text-emerald-100 text-sm mt-1">{copy.modalSubtitle}</p>
          </div>
          <button onClick={handleClose} aria-label={copy.closeLabel} className="p-2 rounded-md bg-white/10 hover:bg-white/20">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-2">
              <div className="text-sm text-slate-600 font-medium">{copy.requestDateLabel}</div>
              <div className="relative">
                <input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
            </label>

            <label className="space-y-2">
              <div className="text-sm text-slate-600 font-medium">{copy.leaveStartLabel}</div>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
            </label>

            <label className="space-y-2">
              <div className="text-sm text-slate-600 font-medium">{copy.leaveEndLabel}</div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                  <Calendar className="w-5 h-5" />
                </span>
              </div>
            </label>
          </div>

          <div>
            <div className="text-sm text-slate-600 font-medium mb-3">{copy.leaveTypeLabel}</div>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="leaveType"
                  value="ANNUAL"
                  checked={leaveType === 'ANNUAL'}
                  onChange={() => setLeaveType('ANNUAL')}
                  className="form-radio text-emerald-600"
                />
                <span>{copy.annualLeave}</span>
              </label>

              <label className="inline-flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="leaveType"
                  value="SICK"
                  checked={leaveType === 'SICK'}
                  onChange={() => setLeaveType('SICK')}
                  className="form-radio text-emerald-600"
                />
                <span>{copy.sickLeave}</span>
              </label>

              <div className="ml-auto flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition"
                >
                  <UploadCloud className="w-4 h-4" /> {copy.uploadLabel}
                </button>
                <div className="text-sm text-slate-500">{file ? file.name : copy.noFile}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-600 font-medium mb-2">{copy.commentsLabel}</div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={copy.commentsPlaceholder}
              className="w-full min-h-[140px] border border-slate-200 rounded-md p-4 text-slate-700 resize-vertical"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {copy.cancel}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-gradient-to-r from-emerald-600 to-green-500 text-white font-medium hover:from-emerald-700 hover:to-green-600 transition shadow-sm"
            >
              {submitting ? copy.submitting : copy.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
