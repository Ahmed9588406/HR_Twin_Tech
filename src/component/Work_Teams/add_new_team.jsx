import React, { useState, useEffect } from 'react';
import { Users, User, X } from 'lucide-react';

export default function AddNewTeam({ onClose, onAddTeam, initialData }) {
  const [formData, setFormData] = useState({
    teamName: '',
    manager: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        teamName: initialData.name || '',
        manager: initialData.managers || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!formData.manager.trim()) newErrors.manager = 'Manager name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddTeam(formData); // Pass the new/updated team data to the parent
      onClose(); // Close the modal after submission
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {initialData ? 'Edit Team' : 'Create New Team'}
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
            Team Name <span className="text-red-500">*</span>
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
              placeholder="Enter team name"
            />
          </div>
          {errors.teamName && <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>}
        </div>

        {/* Manager Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manager Name <span className="text-red-500">*</span>
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
              placeholder="Enter manager name"
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
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            {initialData ? 'Update Team' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
}