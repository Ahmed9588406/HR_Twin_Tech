import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import AttEditModal from './Att_editmodal';
import { useOutletContext } from 'react-router-dom';

export default function Attendance() {
  const { attendanceProfiles, updateAttendanceProfiles } = useOutletContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: '', daysOff: '', normalWorkTiming: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleAdd = () => {
    setIsAdding(true);
    setNewProfile({ name: '', daysOff: '', normalWorkTiming: '' });
  };

  const handleSaveNew = () => {
    if (newProfile.name && newProfile.daysOff) {
      const newId = Math.max(...attendanceProfiles.map(ap => ap.id)) + 1;
      const updatedProfiles = [...attendanceProfiles, { ...newProfile, id: newId }];
      updateAttendanceProfiles(updatedProfiles);
      setIsAdding(false);
      setNewProfile({ name: '', daysOff: '', normalWorkTiming: '' });
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewProfile({ name: '', daysOff: '', normalWorkTiming: '' });
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">Name</th>
              <th className="px-6 py-4 text-green-600 font-semibold">DaysOff</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Normal Work Timing</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceProfiles.map((ap) => (
              <tr
                key={ap.id}
                className="border-t border-green-200 hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-green-600">
                  {ap.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{ap.daysOff}</td>
                <td className="px-6 py-4 text-gray-500">{ap.normalWorkTiming}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(ap)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
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
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Profile name"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newProfile.daysOff}
                    onChange={(e) => setNewProfile({ ...newProfile, daysOff: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Days off"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newProfile.normalWorkTiming}
                    onChange={(e) => setNewProfile({ ...newProfile, normalWorkTiming: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Normal work timing"
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
        <AttEditModal
          profile={selectedProfile}
          onClose={handleCloseModal}
          onSave={(updatedProfile) => {
            const updatedProfiles = attendanceProfiles.map(ap =>
              ap.id === updatedProfile.id ? updatedProfile : ap
            );
            updateAttendanceProfiles(updatedProfiles);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}
