import React, { useEffect, useState } from 'react';
import { CalendarCheck, CreditCard } from 'lucide-react';
import { getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

const TEXT = {
  en: {
    requestsTitle: 'Requests',
    requestsSubtitle: 'Submit a vacation or advance request',
    vacationRequest: 'Vacation Request',
    advanceRequest: 'Advance Request',
    requestsNote: 'Your requests will be sent to HR for approval. You can track status in the Requests section.'
  },
  ar: {
    requestsTitle: 'الطلبات',
    requestsSubtitle: 'إرسال طلب إجازة أو سلفة',
    vacationRequest: 'طلب إجازة',
    advanceRequest: 'طلب سلفة',
    requestsNote: 'سيتم إرسال طلباتك إلى الموارد البشرية للموافقة. يمكنك تتبع الحالة في قسم الطلبات.'
  }
};

export default function EmployeeRequests({ onVacationRequest, onAdvanceRequest }) {
  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="mt-6" dir={dir} lang={lang}>
      <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 rounded-2xl shadow-lg overflow-hidden border border-emerald-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold">{copy.requestsTitle}</h3>
              <p className="text-emerald-100 text-sm mt-1">{copy.requestsSubtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 text-white">
                <CalendarCheck className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 py-4 border-t border-emerald-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onVacationRequest}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 transition transform hover:-translate-y-0.5"
              aria-label={copy.vacationRequest}
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="font-medium">{copy.vacationRequest}</span>
            </button>

            <button
              onClick={onAdvanceRequest}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 transition transform hover:-translate-y-0.5"
              aria-label={copy.advanceRequest}
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">{copy.advanceRequest}</span>
            </button>
          </div>

          <p className="text-xs text-emerald-500 mt-3">{copy.requestsNote}</p>
        </div>
      </div>
    </div>
  );
}
