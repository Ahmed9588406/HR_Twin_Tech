import React, { useState } from 'react';
import { MapPin, Edit2, X, Check, Plus } from 'lucide-react';
import EditModal from './editmodal';
import PinModal from './pinmodal';
import { useOutletContext } from 'react-router-dom';

export default function WorkPlace() {
  const { workplaces, updateWorkplaces } = useOutletContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newWorkplace, setNewWorkplace] = useState({ name: '', type: '', company: '', lat: '', lng: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
  };

  const handleSaveNew = () => {
    if (newWorkplace.name && newWorkplace.type && newWorkplace.company) {
      const newId = Math.max(...workplaces.map(wp => wp.id)) + 1;
      const updatedWorkplaces = [...workplaces, { ...newWorkplace, id: newId, lat: parseFloat(newWorkplace.lat) || 0, lng: parseFloat(newWorkplace.lng) || 0 }];
      updateWorkplaces(updatedWorkplaces);
      setIsAdding(false);
      setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
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

  const handlePin = (workplace) => {
    setSelectedWorkplace(workplace);
    setIsPinModalOpen(true);
  };

  const handleClosePinModal = () => {
    setIsPinModalOpen(false);
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
                  <input
                    type="text"
                    value={newWorkplace.company}
                    onChange={(e) => setNewWorkplace({ ...newWorkplace, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Company"
                  />
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
