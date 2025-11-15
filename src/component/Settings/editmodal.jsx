import React, { useState, useEffect } from 'react';
import { MapPin, Building2, X } from 'lucide-react';
import { updateBranch } from './api/settings_api';
import PinModal from './pinmodal'; // <- added import for map pin picker

export default function EditModal({ workplace, onClose }) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Pin modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState(null); // object passed to PinModal

  useEffect(() => {
    if (workplace) {
      setName(workplace.name ?? '');
      setLatitude(workplace.lat ?? workplace.latitude ?? '');
      setLongitude(workplace.lng ?? workplace.longitude ?? '');
    }
  }, [workplace]);

  const openPinPicker = () => {
    // prepare target object for PinModal: include existing coords and id
    setPinTarget({
      id: workplace?.id,
      lat: Number(latitude) || (workplace?.lat ?? workplace?.latitude) || 0,
      lng: Number(longitude) || (workplace?.lng ?? workplace?.longitude) || 0,
      __isNew: false
    });
    setIsPinModalOpen(true);
  };

  const handlePinModalClose = (result) => {
    setIsPinModalOpen(false);
    setPinTarget(null);
    if (result) {
      // PinModal may return { lat, lng } or { latitude, longitude }
      const newLat = result.lat ?? result.latitude ?? result.latitude;
      const newLng = result.lng ?? result.longitude ?? result.longitude;
      if (newLat !== undefined) setLatitude(newLat);
      if (newLng !== undefined) setLongitude(newLng);
    }
  };

  const handleCancel = () => {
    onClose && onClose(null);
  };

  const handleSave = async () => {
    if (!workplace || !workplace.id) {
      alert('No workplace to update.');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      alert('Latitude and longitude must be valid numbers.');
      return;
    }

    try {
      // Send only the fields being updated (updateBranch will merge with existing)
      const payload = { name, latitude: lat, longitude: lng };
      console.log('Update payload:', payload);
      const updated = await updateBranch(workplace.id, payload);
      console.log('Update response:', updated);
      // map response to local shape for parent
      onClose && onClose(updated);
    } catch (err) {
      console.error('Failed to update branch:', err);
      alert('Failed to update branch: ' + (err.message || err));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
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
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="Branch name"
          />
        </div>

        {/* Latitude and Longitude Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-2">
              Latitude
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Latitude"
              />
              <button
                onClick={openPinPicker}
                title="Pick on map"
                className="text-gray-500 hover:text-green-600 transition-colors p-2"
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Longitude"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-500 text-white"
          >
            Save
          </button>
        </div>
      </div>

      {/* Pin Modal (map picker) */}
      {isPinModalOpen && pinTarget && (
        <PinModal workplace={pinTarget} onClose={handlePinModalClose} />
      )}
    </div>
  );
}