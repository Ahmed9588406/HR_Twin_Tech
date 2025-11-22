import React, { useState, useEffect } from 'react';
import { Minus, Calendar } from 'lucide-react';
import { fetchEmployeeDiscounts } from './employee_role_api';
import { getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

// Constants for hard-coded values
const TEXT = {
  en: {
    discountsTitle: "Discounts & Deductions",
    subtitle: "Recent discounts and penalties",
    naValue: "N/A",
    loadingDiscounts: "Loading discounts...",
    unableToLoad: "Unable to load discounts.",
    noDiscounts: "No discounts available.",
    typeLabel: "Type:"
  },
  ar: {
    discountsTitle: "الخصومات والاستقطاعات",
    subtitle: "الخصومات والعقوبات الحديثة",
    naValue: "غير متوفر",
    loadingDiscounts: "جارٍ تحميل الخصومات...",
    unableToLoad: "تعذر تحميل الخصومات.",
    noDiscounts: "لا توجد خصومات متاحة.",
    typeLabel: "النوع:"
  }
};

export default function EmployeeDiscounts({ empCode }) {
  const [discountsData, setDiscountsData] = useState([]);
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
        setError('Unable to load discounts.');
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
          <div className="mt-3">{copy.loadingDiscounts}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-red-600">{copy.unableToLoad}</div>
      </div>
    );
  }

  if (!discountsData || discountsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">{copy.noDiscounts}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Minus className="w-5 h-5 text-red-600" />
            {copy.discountsTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{copy.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {discountsData.map((discount, index) => (
          <div key={discount.transactionId || index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-3">
              <Minus className="w-6 h-6 text-red-600" />
              <div>
                <div className="font-medium text-slate-800">{discount.description || copy.naValue}</div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {discount.transactionDate ? new Date(discount.transactionDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : copy.naValue}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {copy.typeLabel} {discount.discountType || copy.naValue}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                -${discount.amount?.toFixed(2) || copy.naValue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
