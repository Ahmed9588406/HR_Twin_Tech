import React, { useState, useEffect } from 'react';
import { Briefcase, X } from 'lucide-react';
import { t, getLang } from '../../i18n/translations';

export default function PosEditModal({ position, onClose, onSave }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (position) {
      setName(position.name);
      setDepartment(position.department);
    }
  }, [position]);

  // ensure document lang/dir reflect selected language on mount
  useEffect(() => {
    const lang = getLang() || 'en';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const handleSave = () => {
    const updatedPosition = { ...position, name, department };
    onSave(updatedPosition);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={t('CLOSE')}
        >
          <X size={24} />
        </button>

        {/* Icon Header */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 rounded-2xl shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Department Input */}
        <div className="mb-8">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            {t('DEPARTMENT')}
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder={t('ENTER_DEPARTMENT')}
          />
        </div>

        {/* Position Name Input */}
        <div className="mb-10">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            {t('CHANGE_JOB_POSITION_NAME')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder={t('ENTER_POSITION_NAME')}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
          >
            {t('CANCEL')}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {t('SAVE')}
          </button>
        </div>
      </div>
    </div>
  );
}
