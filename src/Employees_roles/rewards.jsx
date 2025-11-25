import React, { useState, useEffect } from 'react';
import { Award, Calendar } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

const TEXT = {
  en: {
    rewardsTitle: 'Rewards',
    rewardsSubtitle: 'Your recent rewards',
    na: 'N/A'
  },
  ar: {
    rewardsTitle: 'المكافآت',
    rewardsSubtitle: 'مكافآتك الحديثة',
    na: 'غير متوفر'
  }
};

export default function EmployeeRewards({ empCode }) {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Mock data or props usage
  const rewardsData = []; // Assuming this comes from props or API
  const NA_VALUE = copy.na;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            {copy.rewardsTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{copy.rewardsSubtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {rewardsData.map((reward, index) => (
          <div key={reward.transactionId || index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="font-medium text-slate-800">
                  {lang === 'ar' && reward.descriptionAr ? reward.descriptionAr : (reward.description || NA_VALUE)}
                </div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {reward.transactionDate ? new Date(reward.transactionDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : NA_VALUE}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-600">
                +${reward.amount?.toFixed(2) || NA_VALUE}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
