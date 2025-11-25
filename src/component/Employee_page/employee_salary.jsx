import React, { useEffect, useState } from 'react';
import { DollarSign, Calendar, Clock, TrendingUp } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

const TEXT = {
  en: {
    salaryDetails: 'Salary Details',
    loadingSalary: 'Loading salary details...',
    totalDays: 'Total Days',
    totalHours: 'Total Hours',
    basicSalary: 'Basic Salary',
    currentSalary: 'Current Salary'
  },
  ar: {
    salaryDetails: 'تفاصيل الراتب',
    loadingSalary: 'جارٍ تحميل تفاصيل الراتب...',
    totalDays: 'إجمالي الأيام',
    totalHours: 'إجمالي الساعات',
    basicSalary: 'الراتب الأساسي',
    currentSalary: 'الراتب الحالي'
  }
};

export default function EmployeeSalaryCard({ salaryData }) {
  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (!salaryData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
        <div className="text-center text-gray-500">{copy.loadingSalary}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            {copy.salaryDetails}
          </h3>
          <p className="text-sm text-slate-600 mt-1">Employee Code: {salaryData.empCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{copy.totalDays}</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{salaryData.totalDays}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">{copy.totalHours}</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{salaryData.totalHours.toFixed(1)}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">{copy.basicSalary}</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{Math.floor(salaryData.basicSalary)} {_t('CURRENCY')}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">{copy.currentSalary}</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">{salaryData.currentSalary.toFixed(2)} {_t('CURRENCY')}</div>
        </div>
      </div>
    </div>
  );
}
