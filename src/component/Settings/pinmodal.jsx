import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';

export default function PinModal({ workplace, onClose }) {
  const [selectedLat, setSelectedLat] = useState(workplace?.lat || 30.0444);
  const [selectedLng, setSelectedLng] = useState(workplace?.lng || 31.2357);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMapRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = initializeMap;
    document.body.appendChild(script);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.L || leafletMapRef.current) return;

    // Initialize map
    const map = window.L.map(mapRef.current).setView([selectedLat, selectedLng], 13);
    leafletMapRef.current = map;

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Create custom icon
    const customIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); border: 3px solid white;"><div style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Add initial marker
    const marker = window.L.marker([selectedLat, selectedLng], {
      icon: customIcon,
      draggable: true
    }).addTo(map);
    markerRef.current = marker;

    // Update coordinates when marker is dragged
    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      setSelectedLat(parseFloat(position.lat.toFixed(6)));
      setSelectedLng(parseFloat(position.lng.toFixed(6)));
    });

    // Add click handler to map
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setSelectedLat(parseFloat(lat.toFixed(6)));
      setSelectedLng(parseFloat(lng.toFixed(6)));
      marker.setLatLng([lat, lng]);
    });
  };

  // Update marker position when coordinates change via input
  useEffect(() => {
    if (markerRef.current && leafletMapRef.current) {
      markerRef.current.setLatLng([selectedLat, selectedLng]);
      leafletMapRef.current.setView([selectedLat, selectedLng]);
    }
  }, [selectedLat, selectedLng]);

  const handleSave = () => {
    alert(`Pin placed at: ${selectedLat}, ${selectedLng}`);
    onClose();
  };

  const handleCoordinateChange = (lat, lng) => {
    const newLat = parseFloat(lat) || 0;
    const newLng = parseFloat(lng) || 0;
    setSelectedLat(newLat);
    setSelectedLng(newLng);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Place Pin on Map</h2>
            <p className="text-gray-600">Click anywhere on the map or drag the pin</p>
          </div>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="h-96 mb-6 rounded-2xl overflow-hidden shadow-lg"
          style={{ zIndex: 1 }}
        />

        {/* Coordinates Display */}
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-medium mb-2 tracking-wide">
            Selected Coordinates
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={selectedLat}
                onChange={(e) => handleCoordinateChange(e.target.value, selectedLng)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg transition-colors"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={selectedLng}
                onChange={(e) => handleCoordinateChange(selectedLat, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg transition-colors"
                placeholder="Longitude"
              />
            </div>
          </div>
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
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}