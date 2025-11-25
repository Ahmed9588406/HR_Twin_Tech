import React, { useState, useRef, useEffect } from 'react';
import { Building2, X } from 'lucide-react';
import { fetchDepartmentsSimple, changeEmployeeDepartments } from './emp_actions_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';

export default function ChangeDepartmentForm({ selectedActions = [], onClose = () => {}, onSuccess = () => {} }) {
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

  const [departments, setDepartments] = useState([]);
  const [newDepartmentId, setNewDepartmentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // drag state
  const containerRef = useRef(null);
  const [useTransformCenter, setUseTransformCenter] = useState(true);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // drag listeners
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
      const w = el ? el.offsetWidth : 600;
      const h = el ? el.offsetHeight : 400;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
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
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const data = await fetchDepartmentsSimple();
        setDepartments(data || []);
      } catch (err) {
        console.error('Failed to load departments:', err);
        setError('Failed to load departments.');
      } finally {
        setLoadingDepartments(false);
      }
    };
    loadDepartments();
  }, []);

  const validate = () => {
    if (!newDepartmentId) {
      setError(_t('SELECT_NEW_POSITION'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await changeEmployeeDepartments(selectedActions, parseInt(newDepartmentId));
      console.log('Department change result:', result);

      alert(_t('AFFECTED_EMPLOYEES_POSITION', { count: selectedActions.length }));
      onSuccess();
    } catch (err) {
      console.error('Department change failed:', err);
      setError(_t('FAILED_CHANGE_POSITION'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={containerRef}
        style={
          useTransformCenter
            ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
            : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
        }
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100 hover:scale-[1.01]"
      >
        {/* Header */}
        <div
          className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 relative overflow-hidden cursor-grab select-none"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {_t('BULK_CHANGE_DEPARTMENT')}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{_t('DEPARTMENT')}</label>
            {loadingDepartments ? (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">{_t('LOADING')}...</div>
            ) : (
              <select
                value={newDepartmentId}
                onChange={(e) => setNewDepartmentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">{_t('SELECT_DEPT')}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                ))}
              </select>
            )}
          </div>

          {/* Affected Employees */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700">
              {_t('AFFECTED_EMPLOYEES', { count: selectedActions.length })}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {_t('CANCEL')}
            </button>
            <button
              type="submit"
              disabled={submitting || loadingDepartments}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg hover:from-emerald-700 hover:to-green-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? _t('APPLYING') : `${_t('BULK_CHANGE_DEPARTMENT')} (${selectedActions.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
