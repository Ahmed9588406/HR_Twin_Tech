import { Minus, Calendar } from 'lucide-react';
import { fetchEmployeeDiscounts } from './employee_role_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';
import React, { useState, useEffect } from 'react';

// Helper function for formatting dates (matching employee_role_history.jsx)
const formatDate = (dateStr, lang) => {
  const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);

  if (lang === 'ar') {
    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    const dayName = arabicDays[d.getDay()];
    const monthName = arabicMonths[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    return `${dayName}، ${day} ${monthName} ${year}`;
  } else {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};


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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Minus className="w-5 h-5 text-red-600" />
          {_t('DISCOUNTS_TITLE')}
        </h3>
        <p className="text-sm text-slate-600 mt-1">{_t('DISCOUNTS_SUBTITLE')}</p>
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
                  {discount.transactionDate ? formatDate(discount.transactionDate, lang) : _t('NA_VALUE')}
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
