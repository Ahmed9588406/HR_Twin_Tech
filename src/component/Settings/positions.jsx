import React, { useState, useEffect } from 'react';
import { Edit2, X, Check, Plus } from 'lucide-react';
import PosEditModal from './Pos_editmodal';
import { fetchPositions, createPosition, updatePosition as updatePositionApi, deletePosition } from './api/positions_api';
import { fetchDepartments } from './api/department_api';
import { t as _t } from '../../i18n/i18n';

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPosition, setNewPosition] = useState({ name: '', department: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedPositions = await fetchPositions();
      const fetchedDepartments = await fetchDepartments();
      setPositions(fetchedPositions);
      setDepartments(fetchedDepartments);
    };

    loadData();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setNewPosition({ name: '', department: '' });
  };

  const handleSaveNew = async () => {
    if (newPosition.name && newPosition.department) {
      const department = departments.find(d => d.name === newPosition.department);
      if (!department) {
        alert(_t('DEPARTMENT') + ' ' + _t('NOT_FOUND') || 'Department not found.');
        return;
      }

      try {
        await createPosition({
          names: [newPosition.name],
          departmentId: department.id
        });

        // Reload positions after creation
        const fetchedPositions = await fetchPositions();
        setPositions(fetchedPositions);

        setIsAdding(false);
        setNewPosition({ name: '', department: '' });
      } catch (error) {
        console.error('Error saving new position:', error);
        alert(`Failed to add position: ${error.message}`);
      }
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewPosition({ name: '', department: '' });
  };

  const handleEdit = (position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  const updatePosition = async (updatedPosition) => {
    const department = departments.find(d => d.name === updatedPosition.department);
    if (!department) {
      alert('Department not found. Please select a valid department.');
      return;
    }

    try {
      await updatePositionApi({
        id: updatedPosition.id,
        name: updatedPosition.name,
        departmentId: department.id
      });

      // Reload positions after update
      const fetchedPositions = await fetchPositions();
      setPositions(fetchedPositions);

      setIsModalOpen(false);
      setSelectedPosition(null);
    } catch (error) {
      console.error('Error updating position:', error);
      alert(`Failed to update position: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        await deletePosition(id);
        const fetchedPositions = await fetchPositions();
        setPositions(fetchedPositions);
      } catch (error) {
        console.error('Error deleting position:', error);
        alert(`Failed to delete position: ${error.message}`);
      }
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('NAME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('DEPARTMENT')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('ACTIONS')}</th>
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
                      onClick={() => handleDelete(pos.id)}
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
                    placeholder={_t('NAME')}
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={newPosition.department}
                    onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">{_t('SELECT_DEPT')}</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNew}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title={_t('SAVE')}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title={_t('CANCEL')}
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
                <td colSpan={3} className="relative py-6">
                  <div className="flex justify-center">
                    <button
                      onClick={handleAdd}
                      className="bg-green-400 hover:bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200"
                      title={_t('ADD') || 'Add'}
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
