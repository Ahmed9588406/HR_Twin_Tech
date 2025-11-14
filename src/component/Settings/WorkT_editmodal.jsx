import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

export default function WorkTEditModal({ timing, onClose, onSave }) {
  const [name, setName] = useState('');
  const [signInRange, setSignInRange] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [missingSignIn, setMissingSignIn] = useState('');

  useEffect(() => {
    if (timing) {
      setName(timing.name || '');
      setSignInRange(timing.signInRange || '');
      setWorkHours(timing.workHours || '');
      setMissingSignIn(timing.missingSignIn || '');
    }
  }, [timing]);

  const handleSave = () => {
    const updatedTiming = { ...timing, name, signInRange, workHours, missingSignIn };
    onSave(updatedTiming);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] relative">
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
            <Clock className="w-10 h-10 text-white" />
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
            placeholder="Enter name"
          />
        </div>

        {/* Sign In Range Input */}
        <div className="mb-8">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Sign In Range
          </label>
          <input
            type="text"
            value={signInRange}
            onChange={(e) => setSignInRange(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="e.g., 30 min"
          />
        </div>

        {/* Work Hours Input */}
        <div className="mb-8">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Work Hours
          </label>
          <input
            type="text"
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="e.g., 8 hours"
          />
        </div>

        {/* Missing Sign In Input */}
        <div className="mb-10">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Missing Sign In
          </label>
          <input
            type="text"
            value={missingSignIn}
            onChange={(e) => setMissingSignIn(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="e.g., 2 hours"
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
