import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

export default function AttEditModal({ profile, onClose, onSave }) {
  const [name, setName] = useState('');
  const [daysOff, setDaysOff] = useState('');
  const [normalWorkTiming, setNormalWorkTiming] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDaysOff(profile.daysOff || '');
      setNormalWorkTiming(profile.normalWorkTiming || '');
    }
  }, [profile]);

  const handleSave = () => {
    const updatedProfile = { ...profile, name, daysOff, normalWorkTiming };
    onSave(updatedProfile);
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

        {/* Icon Header */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 rounded-2xl shadow-lg">
            <Settings className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-8">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="Enter profile name"
          />
        </div>

        {/* DaysOff Input */}
        <div className="mb-8">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            DaysOff
          </label>
          <input
            type="text"
            value={daysOff}
            onChange={(e) => setDaysOff(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="Enter days off"
          />
        </div>

        {/* Normal Work Timing Input */}
        <div className="mb-10">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Normal Work Timing
          </label>
          <input
            type="text"
            value={normalWorkTiming}
            onChange={(e) => setNormalWorkTiming(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="Enter normal work timing"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
