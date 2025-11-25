import React, { useState, useEffect } from 'react';
import { fetchCompanySettings, updateCompanySettings } from './api/settings_api';
import { getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';
import { Check, X } from 'lucide-react';

const TEXT = {
  en: {
    title: 'Company Settings',
    loading: 'Loading settings...',
    save: 'Save',
    cancel: 'Cancel',
    success: 'Settings updated successfully.',
    fail: 'Failed to update settings.',
    fields: {
      id: 'ID',
      name: 'Company Name',
      currantBranchNum: 'Current Branches',
      currantEmpNum: 'Current Employees',
      branchNumLimit: 'Branch Limit',
      empNumLimit: 'Employee Limit',
      delayTime: 'Delay Time (mins)',
      delayHour: 'Delay Hour',
      overTimeMins: 'Overtime Minutes',
      discountPercent: 'Discount Percent',
      overTimePercent: 'Overtime Percent',
      terminationNoticeLimit: 'Termination Notice Limit'
    },
    validationNumber: 'Please enter valid numeric values.'
  },
  ar: {
    title: 'إعدادات الشركة',
    loading: 'جارٍ تحميل الإعدادات...',
    save: 'حفظ',
    cancel: 'إلغاء',
    success: 'تم تحديث الإعدادات بنجاح.',
    fail: 'فشل في تحديث الإعدادات.',
    fields: {
      id: 'المعرف',
      name: 'اسم الشركة',
      currantBranchNum: 'الفروع الحالية',
      currantEmpNum: 'الموظفون الحاليون',
      branchNumLimit: 'حد الفروع',
      empNumLimit: 'حد الموظفين',
      delayTime: 'زمن التأخير (دقائق)',
      delayHour: 'ساعة التأخير',
      overTimeMins: 'دقائق العمل الإضافي',
      discountPercent: 'نسبة الخصم',
      overTimePercent: 'نسبة العمل الإضافي',
      terminationNoticeLimit: 'حد إشعارات الفصل'
    },
    validationNumber: 'يرجى إدخال قيم رقمية صحيحة.'
  }
};

export default function CompanySettings() {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => { const unsub = _subscribe((l) => setLang(l)); return () => unsub(); }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);

  // editable fields state
  const [form, setForm] = useState({
    delayTime: '',
    delayHour: '',
    overTimeMins: '',
    discountPercent: '',
    overTimePercent: '',
    terminationNoticeLimit: ''
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCompanySettings();
        if (!mounted) return;
        setCompany(data || null);
        if (data) {
          setForm({
            delayTime: data.delayTime ?? '',
            delayHour: data.delayHour ?? '',
            overTimeMins: data.overTimeMins ?? '',
            discountPercent: data.discountPercent ?? '',
            overTimePercent: data.overTimePercent ?? '',
            terminationNoticeLimit: data.terminationNoticeLimit ?? data.terminationNoticeLimit === 0 ? 0 : ''
          });
        }
      } catch (err) {
        setError(copy.fail);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [lang]); // reload on language change for UX consistency

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const nums = ['delayTime','delayHour','overTimeMins','discountPercent','overTimePercent','terminationNoticeLimit'];
    for (const k of nums) {
      const v = form[k];
      if (v === '' || v === null || v === undefined || isNaN(Number(v))) return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert(copy.validationNumber);
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      delayTime: Number(form.delayTime),
      delayHour: Number(form.delayHour),
      overTimeMins: Number(form.overTimeMins),
      discountPercent: Number(form.discountPercent),
      overTimePercent: Number(form.overTimePercent),
      terminationNoticeLimit: Number(form.terminationNoticeLimit)
    };
    try {
      const res = await updateCompanySettings(payload);
      // successful update: re-fetch or update UI
      const refreshed = await fetchCompanySettings();
      setCompany(refreshed || company);
      setForm({
        delayTime: refreshed?.delayTime ?? payload.delayTime,
        delayHour: refreshed?.delayHour ?? payload.delayHour,
        overTimeMins: refreshed?.overTimeMins ?? payload.overTimeMins,
        discountPercent: refreshed?.discountPercent ?? payload.discountPercent,
        overTimePercent: refreshed?.overTimePercent ?? payload.overTimePercent,
        terminationNoticeLimit: refreshed?.terminationNoticeLimit ?? payload.terminationNoticeLimit
      });
      alert(copy.success);
    } catch (err) {
      setError(copy.fail + (err && err.message ? ' - ' + err.message : ''));
      alert(copy.fail);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
        <div className="text-center text-slate-600">{copy.loading}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">{copy.title}</h3>
        <div className="text-sm text-red-600">{error}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-slate-600">{copy.fields.id}</label>
          <div className="mt-1 text-sm font-medium text-slate-800">{company?.id ?? '—'}</div>
        </div>
        <div>
          <label className="text-xs text-slate-600">{copy.fields.name}</label>
          <div className="mt-1 text-sm font-medium text-slate-800">{company?.name ?? '—'}</div>
        </div>

        <div>
          <label className="text-xs text-slate-600">{copy.fields.currantBranchNum}</label>
          <div className="mt-1 text-sm font-medium text-slate-800">{company?.currantBranchNum ?? '—'}</div>
        </div>
        <div>
          <label className="text-xs text-slate-600">{copy.fields.currantEmpNum}</label>
          <div className="mt-1 text-sm font-medium text-slate-800">{company?.currantEmpNum ?? '—'}</div>
        </div>

        <div>
          <label className="text-xs text-slate-600">{copy.fields.branchNumLimit}</label>
          <div className="mt-1 text-sm font-medium text-slate-800">{company?.branchNumLimit ?? '—'}</div>
        </div>
        <div>
          <label className="text-xs text-slate-600">{copy.fields.empNumLimit}</label>
          <div className="mt-1 text-sm font-medium text-slate-800">{company?.empNumLimit ?? '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="space-y-1">
          <div className="text-xs text-slate-600">{copy.fields.delayTime}</div>
          <input
            type="number"
            value={form.delayTime}
            onChange={(e) => onChange('delayTime', e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs text-slate-600">{copy.fields.delayHour}</div>
          <input
            type="number"
            step="0.1"
            value={form.delayHour}
            onChange={(e) => onChange('delayHour', e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs text-slate-600">{copy.fields.overTimeMins}</div>
          <input
            type="number"
            value={form.overTimeMins}
            onChange={(e) => onChange('overTimeMins', e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs text-slate-600">{copy.fields.discountPercent}</div>
          <input
            type="number"
            step="0.1"
            value={form.discountPercent}
            onChange={(e) => onChange('discountPercent', e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs text-slate-600">{copy.fields.overTimePercent}</div>
          <input
            type="number"
            step="0.1"
            value={form.overTimePercent}
            onChange={(e) => onChange('overTimePercent', e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs text-slate-600">{copy.fields.terminationNoticeLimit}</div>
          <input
            type="number"
            value={form.terminationNoticeLimit}
            onChange={(e) => onChange('terminationNoticeLimit', e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          <Check className="w-4 h-4" /> {copy.save}
        </button>
        <button
          onClick={() => {
            if (company) {
              setForm({
                delayTime: company.delayTime ?? '',
                delayHour: company.delayHour ?? '',
                overTimeMins: company.overTimeMins ?? '',
                discountPercent: company.discountPercent ?? '',
                overTimePercent: company.overTimePercent ?? '',
                terminationNoticeLimit: company.terminationNoticeLimit ?? ''
              });
            }
          }}
          className="px-4 py-2 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50"
        >
          <X className="w-4 h-4 inline" /> {copy.cancel}
        </button>
      </div>
    </div>
  );
}
