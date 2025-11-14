import React, { useState, useEffect } from 'react';
import { MapPin, Building2, X } from 'lucide-react';

export default function EditModal({ workplace, onClose }) {
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState(['Sat']);
  const [startTime, setStartTime] = useState('10.0');
  const [endTime, setEndTime] = useState('18.0');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (workplace) {
      setName(workplace.name);
    }
  }, [workplace]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const removeDay = (day) => {
    setSelectedDays(selectedDays.filter(d => d !== day));
  };

  const handleSave = () => {
    alert(`Saved!\nLocation: ${name}\nDays: ${selectedDays.join(', ')}\nHours: ${startTime} - ${endTime}`);
    onClose();
  };

  const handleSetLocation = () => {
    if (workplace) {
      const url = `https://www.google.com/maps?q=${workplace.lat},${workplace.lng}&z=15&t=m`;
      window.open(url, '_blank');
    }
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
            <Building2 className="w-10 h-10 text-white" />
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
            placeholder="Enter location name"
          />
        </div>

        {/* Select Days */}
        <div className="mb-8">
          <label className="block text-green-500 text-sm font-semibold mb-4 tracking-wide">
            Select Days
          </label>
          
          {/* Selected Days Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedDays.map(day => (
              <div
                key={day}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
              >
                <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => removeDay(day)} />
                <span className="font-medium">{day}</span>
              </div>
            ))}
          </div>

          {/* Day Selector Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                  selectedDays.includes(day)
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="mb-10">
          <label className="block text-green-500 text-sm font-semibold mb-4 tracking-wide">
            Working Hours
          </label>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-500 text-xs font-medium mb-2 uppercase">
                Start Time
              </label>
              <input
                type="number"
                step="0.5"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-xs font-medium mb-2 uppercase">
                End Time
              </label>
              <input
                type="number"
                step="0.5"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSetLocation}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Set Location
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}