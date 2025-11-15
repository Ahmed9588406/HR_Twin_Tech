import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { updateCompanySettings } from './api/settings_api';

export default function WorkTEditModal({ timing, onClose, onSave }) {
  const [delayHours, setDelayHours] = useState('');
  const [delayMinutes, setDelayMinutes] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [overtimePercent, setOvertimePercent] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (timing) {
      // support different naming sources
      setDelayHours(timing.delayHour ?? timing.delayHours ?? '');
      setDelayMinutes(timing.delayTime ?? timing.delayMinutes ?? '');
      setDiscountPercent(timing.discountPercent ?? '');
      setOvertimePercent(timing.overTimePercent ?? timing.overtimePercent ?? '');
    }
  }, [timing]);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    const payload = {
      delayTime: Number(delayMinutes) || 0,
      delayHour: Number(delayHours) || 0,
      discountPercent: Number(discountPercent) || 0,
      overTimePercent: Number(overtimePercent) || 0
    };

    try {
      const updatedCompany = await updateCompanySettings(payload);
      // pass server response back to parent and close
      onSave(updatedCompany);
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
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
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Company Logo Header (styled like Pos modal) */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Delay Section */}
        <h3 className="text-xl font-semibold text-green-500 mb-4">Delay</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
              Delay Hours
            </label>
            <input
              type="number"
              step="0.1"
              value={delayHours}
              onChange={(e) => setDelayHours(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
              placeholder="1.0"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
              Delay Minutes (delayTime)
            </label>
            <input
              type="number"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
              placeholder="30"
            />
          </div>
        </div>

        {/* Percentage Section */}
        <h3 className="text-xl font-semibold text-green-500 mb-4">Percentage</h3>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
              Discount Percent
            </label>
            <input
              type="number"
              step="0.1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
              placeholder="150.0"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
              Overtime Percent
            </label>
            <input
              type="number"
              step="0.1"
              value={overtimePercent}
              onChange={(e) => setOvertimePercent(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
              placeholder="150.0"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Action Buttons (match Pos modal style) */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}