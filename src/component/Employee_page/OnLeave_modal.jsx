import React, { useState, useEffect } from 'react';
import { X, Clock, Check } from 'lucide-react';
import { markLeave } from './api/emplyee_api';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

const TEXT = {
  en: {
    markLeave: 'Mark Leave',
    leaveTime: 'Leave Time',
    cancel: 'Cancel',
    marking: 'Marking...',
    markLeaveBtn: 'Mark Leave'
  },
  ar: {
    markLeave: 'تسجيل الإجازة',
    leaveTime: 'وقت الإجازة',
    cancel: 'إلغاء',
    marking: 'جارٍ التسجيل...',
    markLeaveBtn: 'تسجيل الإجازة'
  }
};

export default function OnLeaveModal({ employee, onClose, onSuccess }) {
  const [leaveTime, setLeaveTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await markLeave(employee.code, leaveTime);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir={dir} lang={lang}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{copy.markLeave}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {copy.leaveTime}
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={leaveTime}
                onChange={(e) => setLeaveTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copy.cancel}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {copy.marking}
                </>
              ) : (
                <>
                  <Check size={16} />
                  {copy.markLeaveBtn}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
