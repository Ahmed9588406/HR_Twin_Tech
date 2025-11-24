import { Minus, Calendar } from 'lucide-react';
import { fetchEmployeeDiscounts } from './employee_role_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';
import React, { useState, useEffect, useRef } from 'react';

export default function EmployeeDiscounts({ empCode }) {
  const [discountsData, setDiscountsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // i18n + rtl
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // draggable state (card)
  const containerRef = useRef(null);
  const [useTransformCenter, setUseTransformCenter] = useState(true);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
      const w = el ? el.offsetWidth : 520;
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

  useEffect(() => {
    let mounted = true;
    const loadDiscounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployeeDiscounts(empCode);
        if (!mounted) return;
        setDiscountsData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch discounts data:', err);
        if (!mounted) return;
        setError(_t('UNABLE_LOAD_DISCOUNTS'));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (empCode) {
      loadDiscounts();
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [empCode]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto" />
          <div className="mt-3">{_t('LOADING_DISCOUNTS')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-red-600">{_t('UNABLE_LOAD_DISCOUNTS')}</div>
      </div>
    );
  }

  if (!discountsData || discountsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">{_t('NO_DISCOUNTS')}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={
        useTransformCenter
          ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'fixed' }
          : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'fixed' }
      }
      className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 max-w-2xl"
      dir={dir}
      lang={lang}
    >
      {/* make header draggable */}
      <div onMouseDown={startDrag} onTouchStart={startDrag} className="cursor-grab">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-600" />
              {_t('DISCOUNTS_TITLE')}
            </h3>
            <p className="text-sm text-slate-600 mt-1">{_t('DISCOUNTS_SUBTITLE')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {discountsData.map((discount, index) => (
          <div key={discount.transactionId || index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-3">
              <Minus className="w-6 h-6 text-red-600" />
              <div>
                <div className="font-medium text-slate-800">{discount.description || _t('NA_VALUE')}</div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {discount.transactionDate ? new Date(discount.transactionDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : _t('NA_VALUE')}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {_t('TYPE_LABEL')} {discount.discountType || _t('NA_VALUE')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                -{discount.amount?.toFixed(2) ?? _t('NA_VALUE')} {_t('CURRENCY')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
