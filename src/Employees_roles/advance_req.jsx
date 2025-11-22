import React, { useState, useRef, useEffect } from 'react';
import { Calendar, DollarSign, X } from 'lucide-react';
import { postAdvanceRequest } from './employee_role_api';
import { getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

const TEXT = {
  en: {
    modalTitle: 'Advance Request',
    modalSubtitle: 'Submit salary advance details',
    closeLabel: 'Close',
    submissionDateLabel: 'Submission Date',
    amountLabel: 'Amount',
    installmentStartLabel: 'Installment Start Date',
    commentsLabel: 'Comments',
    commentsPlaceholder: 'Write here...',
    paymentFromSalary: 'Payment from salary slip',
    submit: 'Advance Request',
    submitting: 'Submitting...',
    validationMissingDate: 'Please select submission date',
    validationInvalidAmount: 'Please enter a valid amount',
    submitSuccess: 'Advance request submitted.',
    submitFailureFallback: 'Failed to submit advance request. Try again.',
    failurePrefix: 'Advance request failed:'
  },
  ar: {
    modalTitle: 'طلب سلفة',
    modalSubtitle: 'إرسال تفاصيل السلفة الراتبية',
    closeLabel: 'إغلاق',
    submissionDateLabel: 'تاريخ التقديم',
    amountLabel: 'المبلغ',
    installmentStartLabel: 'تاريخ بدء القسط',
    commentsLabel: 'ملاحظات',
    commentsPlaceholder: 'اكتب هنا...',
    paymentFromSalary: 'الدفع من راتب الشريحة',
    submit: 'طلب سلفة',
    submitting: 'جارٍ الإرسال...',
    validationMissingDate: 'يرجى اختيار تاريخ التقديم',
    validationInvalidAmount: 'يرجى إدخال مبلغ صحيح',
    submitSuccess: 'تم إرسال طلب السلفة.',
    submitFailureFallback: 'فشل في إرسال طلب السلفة. حاول مرة أخرى.',
    failurePrefix: 'فشل طلب السلفة:'
  }
};

/**
 * AdvanceRequest - centered draggable modal
 * Props:
 *  - employee: { code }
 *  - onClose: () => void
 *  - onSuccess: () => void
 */
export default function AdvanceRequest({ employee = {}, onClose = () => {}, onSuccess = () => {} }) {
  const [submissionDate, setSubmissionDate] = useState('');
  const [installmentStart, setInstallmentStart] = useState('');
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [fromSalary, setFromSalary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // drag state
  const containerRef = useRef(null);
  const [useTransformCenter, setUseTransformCenter] = useState(true);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // drag listeners
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const left = clientX - offset.x;
      const top = clientY - offset.y;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = containerRef.current;
      const w = el ? el.offsetWidth : 760;
      const h = el ? el.offsetHeight : 320;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
    };

    const onUp = () => { if (isDragging) setIsDragging(false); };

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
    if (useTransformCenter) {
      setPos({ left: rect.left, top: rect.top });
      setUseTransformCenter(false);
    }
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
    e.preventDefault();
  };

  const reset = () => {
    setSubmissionDate(''); setInstallmentStart(''); setAmount(''); setComments(''); setFromSalary(false);
  };

  const validate = () => {
    if (!submissionDate) { alert(copy.validationMissingDate); return false; }
    if (!amount || Number(amount) <= 0) { alert(copy.validationInvalidAmount); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Build payload exactly as requested
      const payload = {
        requestDate: submissionDate, // e.g. "2025-11-18"
        amount: Number(amount),      // numeric
        comment: comments || '',     // string
        paymentDate: installmentStart || '' // use installmentStart as paymentDate
      };

      // call helper
      const result = await postAdvanceRequest(payload);
      console.log('Advance request result:', result);

      alert(copy.submitSuccess);
      reset();
      onSuccess();
    } catch (err) {
      console.error('Advance request failed:', err);
      // show user-friendly message if available
      let msg = copy.submitFailureFallback;
      try {
        const m = String(err.message || err);
        const possibleJson = m.trim().startsWith('{') ? JSON.parse(m) : null;
        if (possibleJson && possibleJson.message) msg = possibleJson.message;
        else if (m) msg = m;
      } catch {}
      alert(`${copy.failurePrefix} ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" dir={dir} lang={lang}>
      <div
        ref={containerRef}
        style={
          useTransformCenter
            ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
            : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
        }
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
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
          <div className="flex items-center gap-2">
            <button onClick={handleClose} aria-label={copy.closeLabel} className="p-2 rounded-md bg-white/10 hover:bg-white/20">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <label className="space-y-1">
              <div className="text-sm font-medium text-slate-600">{copy.submissionDateLabel}</div>
              <div className="relative">
                <input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400"><Calendar className="w-5 h-5" /></span>
              </div>
            </label>

            <label className="space-y-1">
              <div className="text-sm font-medium text-slate-600">{copy.amountLabel}</div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={copy.amountLabel}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400"><DollarSign className="w-5 h-5" /></span>
              </div>
            </label>

            <label className="space-y-1">
              <div className="text-sm font-medium text-slate-600">{copy.installmentStartLabel}</div>
              <div className="relative">
                <input
                  type="date"
                  value={installmentStart}
                  onChange={(e) => setInstallmentStart(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 pr-10 bg-white text-slate-700"
                />
                <span className="absolute right-3 top-2.5 text-slate-400"><Calendar className="w-5 h-5" /></span>
              </div>
            </label>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-slate-600 mb-2">{copy.commentsLabel}</div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={copy.commentsPlaceholder}
              className="w-full min-h-[120px] border border-slate-200 rounded-md p-4 text-slate-700 resize-vertical"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                checked={fromSalary}
                onChange={(e) => setFromSalary(e.target.checked)}
                className="form-checkbox text-emerald-600"
              />
              <span>{copy.paymentFromSalary}</span>
            </label>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-emerald-600 to-green-500 text-white font-medium hover:from-emerald-700 hover:to-green-600 transition-shadow"
              >
                {submitting ? copy.submitting : copy.submit}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
