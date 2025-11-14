import React, { useState } from 'react';
import { Edit2, X, Check, Plus } from 'lucide-react';
import PosEditModal from './Pos_editmodal';

const initialPositions = [
  { id: 1, name: 'Software Engineer', department: 'Engineering', employees: 5 },
  { id: 2, name: 'Marketing Manager', department: 'Marketing', employees: 3 },
  { id: 3, name: 'HR Specialist', department: 'HR', employees: 2 },
];

export default function Positions() {
  const [positions, setPositions] = useState(initialPositions);
  const [isAdding, setIsAdding] = useState(false);
  const [newPosition, setNewPosition] = useState({ name: '', department: '', employees: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleAdd = () => {
    setIsAdding(true);
    setNewPosition({ name: '', department: '', employees: '' });
  };

  const handleSaveNew = () => {
    if (newPosition.name && newPosition.department && newPosition.employees) {
      const newId = Math.max(...positions.map(p => p.id)) + 1;
      setPositions([...positions, { ...newPosition, id: newId, employees: parseInt(newPosition.employees) }]);
      setIsAdding(false);
      setNewPosition({ name: '', department: '', employees: '' });
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewPosition({ name: '', department: '', employees: '' });
  };

  const handleEdit = (position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  const updatePosition = (updatedPosition) => {
    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === updatedPosition.id ? updatedPosition : pos
      )
    );
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">Name</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Department</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Number of Employees</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr
                key={pos.id}
                className="border-t border-green-200 hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-green-600">
                  {pos.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{pos.department}</td>
                <td className="px-6 py-4 text-gray-500">{pos.employees}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(pos)}
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
                    value={newPosition.name}
                    onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Position name"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newPosition.department}
                    onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Department"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newPosition.employees}
                    onChange={(e) => setNewPosition({ ...newPosition, employees: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Number of employees"
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
                      title="Add Position"
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
        <PosEditModal
          position={selectedPosition}
          onClose={handleCloseModal}
          onSave={updatePosition}
        />
      )}
    </div>
  );
}
