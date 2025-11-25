import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function DeleteModalTransaction({ transaction, type = 'reward', onClose, onSuccess, nonBlocking = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);
  const isRtl = lang === 'ar';

  // draggable state
  const containerRef = useRef(null);
  const [useTransformCenter, setUseTransformCenter] = useState(true);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // prevent body scroll while modal open, only when blocking (fullscreen)
  useEffect(() => {
    if (nonBlocking) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [nonBlocking]);

  // if nonBlocking, initialize position near top-right
  useEffect(() => {
    if (!nonBlocking) return;
    // run after first paint to get viewport size
    const init = () => {
      const vw = window.innerWidth;
      const defaultW = 360;
      const left = Math.max(12, vw - defaultW - 24);
      setUseTransformCenter(false);
      setPos({ left, top: 24 });
    };
    init();
  }, [nonBlocking]);

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
      const w = el ? el.offsetWidth : 560;
      const h = el ? el.offsetHeight : 360;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
      e.preventDefault && e.preventDefault();
    };

    const onUp = () => { if (isDragging) setIsDragging(false); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove, { passive: false });
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Auth token not found; please log in again.');
      }

      const response = await fetch(
        `https://api.shl-hr.com/api/v1/financial/${transaction.transactionId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete ${type}: ${response.status} - ${text}`);
      }

      onSuccess(transaction.transactionId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const title = _t('DELETE_TRANSACTION').replace('{{type}}', type.charAt(0).toUpperCase() + type.slice(1));
  const description = _t('PERMANENT_DELETE_DESCRIPTION');

  const modalContent = (
    <>
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-100 to-orange-100 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div
          className="flex items-start justify-between mb-6 cursor-grab select-none"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{_t('CONFIRM_DELETION')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:rotate-90 transform group"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-1">{_t('WARNING')}</h4>
              <p className="text-sm text-red-700">{description}</p>
            </div>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{_t('AMOUNT')}</span>
            <span className="text-lg font-bold text-gray-900">{transaction.amount.toFixed(2)} {_t('CURRENCY')}</span>
          </div>
          {transaction.transactionId && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">{_t('TRANSACTION_ID')}</span>
              <span className="text-xs font-mono text-gray-600">{transaction.transactionId}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">{_t('ERROR')}</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            disabled={loading}
          >
            {_t('CANCEL')}
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-600 rounded-xl hover:from-red-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {_t('DELETING')}
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                {_t('DELETE')}
              </>
            )}
          </button>
        </div>

        {/* Helper Text */}
        <p className="mt-4 text-xs text-center text-gray-500">
          {_t('PERMANENT_ACTION')}
        </p>
      </div>
    </>
  );

  // Render: full-screen blocking overlay when nonBlocking=false,
  // small floating non-blocking panel when nonBlocking=true
  return (
    nonBlocking ? (
      <div className={`relative z-40 ${isRtl ? 'rtl' : ''}`}>
        <div
          ref={containerRef}
          style={
            useTransformCenter
              ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'fixed', right: '24px', bottom: '24px' }
              : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'fixed' }
          }
          className="bg-white rounded-2xl shadow-2xl w-80 max-w-xs transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
        >
          {modalContent}
        </div>
      </div>
    ) : (
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 ${isRtl ? 'rtl' : ''}`}>
        <div
          ref={containerRef}
          style={
            useTransformCenter
              ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
              : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
          }
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
        >
          {modalContent}
        </div>
      </div>
    )
  );
}