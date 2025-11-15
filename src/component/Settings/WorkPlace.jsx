import React, { useState, useEffect } from 'react';
import { MapPin, Edit2, X, Check, Plus } from 'lucide-react';
import EditModal from './editmodal';
import PinModal from './pinmodal';
import { fetchBranches, fetchBranchById, createBranch } from './api/settings_api';

export default function WorkPlace() {
  const [workplaces, setWorkplaces] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newWorkplace, setNewWorkplace] = useState({ name: '', type: '', company: '', lat: '', lng: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      const data = await fetchBranches();
      console.log('Setting workplaces:', data);
      setWorkplaces(data);
    };
    loadBranches();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
  };

  const handleSaveNew = async () => {
    if (!newWorkplace.name || !newWorkplace.lat || !newWorkplace.lng) {
      alert('Please provide name, latitude and longitude.');
      return;
    }

    try {
      const lat = parseFloat(newWorkplace.lat);
      const lng = parseFloat(newWorkplace.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        alert('Latitude and longitude must be valid numbers.');
        return;
      }

      const branchData = {
        name: newWorkplace.name,
        latitude: lat,
        longitude: lng
      };

      const createdBranch = await createBranch(branchData);
      const updatedWorkplaces = [
        ...workplaces,
        {
          id: createdBranch.id,
          name: createdBranch.name,
          lat: createdBranch.latitude,
          lng: createdBranch.longitude,
          type: createdBranch.type,
          company: createdBranch.companyName
        }
      ];
      setWorkplaces(updatedWorkplaces);
      setIsAdding(false);
      setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
    } catch (error) {
      alert('Failed to create branch: ' + (error.message || error));
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
  };

  const handleEdit = (workplace) => {
    setSelectedWorkplace(workplace);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkplace(null);
  };

  // Open pin modal for existing workplace (tag as not-new)
  const handlePin = (workplace) => {
    setSelectedWorkplace({ ...workplace, __isNew: false });
    setIsPinModalOpen(true);
  };

  // Open pin modal for the add-row/new workplace
  const handlePinForNew = () => {
    setSelectedWorkplace({ ...newWorkplace, __isNew: true });
    setIsPinModalOpen(true);
  };

  // Accept optional updated workplace from PinModal
  const handleClosePinModal = (updatedWorkplace) => {
    setIsPinModalOpen(false);

    if (updatedWorkplace) {
      if (updatedWorkplace.__isNew) {
        // fill add-row inputs with picked coords
        setNewWorkplace((prev) => ({
          ...prev,
          lat: updatedWorkplace.lat,
          lng: updatedWorkplace.lng
        }));
      } else {
        // update existing workplace coords in list
        setWorkplaces((prev) =>
          prev.map((wp) =>
            wp.id === updatedWorkplace.id ? { ...wp, lat: updatedWorkplace.lat, lng: updatedWorkplace.lng } : wp
          )
        );
      }
    }

    setSelectedWorkplace(null);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">Name</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Type</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Company</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Actions</th>
            </tr>
            {/* <tr>
              <th colSpan={4} className="px-6 py-2">
                <button
                  onClick={handleTestFetch}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Test Fetch Branch by ID (1)
                </button>
              </th>
            </tr> */}
          </thead>
          <tbody>
            {workplaces.map((wp) => (
              <tr
                key={wp.id}
                className="border-t border-green-200 hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-green-600">
                  {wp.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{wp.type}</td>
                <td className="px-6 py-4 text-gray-500">{wp.company}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePin(wp)}
                      className="text-gray-500 hover:text-green-600 transition-colors"
                      title="Place Pin on Map"
                    >
                      <MapPin size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(wp)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* New row for adding */}
            {isAdding && (
              <tr className="border-t border-green-200 bg-green-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newWorkplace.name}
                    onChange={(e) => setNewWorkplace({ ...newWorkplace, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Workplace name"
                  />
                </td>

                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newWorkplace.type}
                    onChange={(e) => setNewWorkplace({ ...newWorkplace, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type"
                  />
                </td>

                <td className="px-6 py-4">
                  {/* Company input + small coords inputs underneath */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={newWorkplace.company}
                      onChange={(e) => setNewWorkplace({ ...newWorkplace, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Company"
                    />

                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        step="any"
                        value={newWorkplace.lat}
                        onChange={(e) => setNewWorkplace({ ...newWorkplace, lat: e.target.value })}
                        className="w-1/2 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        step="any"
                        value={newWorkplace.lng}
                        onChange={(e) => setNewWorkplace({ ...newWorkplace, lng: e.target.value })}
                        className="w-1/2 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="Longitude"
                      />

                      {/* Set Pin button for add-row */}
                      <button
                        onClick={handlePinForNew}
                        title="Pick on map"
                        className="ml-2 text-gray-500 hover:text-green-600 transition-colors"
                      >
                        <MapPin size={18} />
                      </button>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNew}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Save"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {/* Empty row for floating button */}
            {!isAdding && (
              <tr>
                <td colSpan={4} className="relative py-6">
                  <div className="flex justify-center">
                    <button
                      onClick={handleAdd}
                      className="bg-green-400 hover:bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200"
                      title="Add Work Place"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditModal 
          workplace={selectedWorkplace} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Pin Modal */}
      {isPinModalOpen && (
        <PinModal 
          workplace={selectedWorkplace} 
          onClose={handleClosePinModal} 
        />
      )}
    </div>
  );
}
