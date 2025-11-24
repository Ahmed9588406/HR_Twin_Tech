import React, { useState, useEffect } from 'react';
import { Users, User, X } from 'lucide-react';
import { createTeam, updateTeam } from './api/work_teams_api';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';
import translations from '../../i18n/translations';

export default function AddNewTeam({ onClose, onAddTeam, initialData }) {
  const [formData, setFormData] = useState({
    teamName: '',
    manager: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState(_getLang());
  const t = (key, params = {}) => {
    const langData = translations[lang] || translations.en;
    let text = langData[key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    return text;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        teamName: initialData.name || '',
        manager: initialData.managers || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = t('TEAM_NAME_REQUIRED');
    if (!formData.manager.trim()) newErrors.manager = t('MANAGER_NAME_REQUIRED');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        if (initialData) {
          // Update existing team
          await updateTeam(initialData.id, formData);
        } else {
          // Create new team
          await createTeam(formData);
        }
        onAddTeam(formData); // Notify parent
        onClose();
      } catch (error) {
        alert(`Failed to ${initialData ? 'update' : 'create'} team: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {initialData ? t('EDIT_TEAM') : t('CREATE_NEW_TEAM')}
        </h1>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('NAME')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.teamName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
              placeholder={t('ENTER_FULL_NAME')}
            />
          </div>
          {errors.teamName && <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>}
        </div>

        {/* Manager Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('MANAGER')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.manager
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
              placeholder={t('ENTER_FULL_NAME')}
            />
          </div>
          {errors.manager && <p className="mt-1 text-sm text-red-600">{errors.manager}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            {t('CANCEL')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? (initialData ? t('UPDATING') : t('CREATING')) : (initialData ? t('UPDATE_TEAM') : t('CREATE_TEAM'))}
          </button>
        </div>
      </form>
    </div>
  );
}