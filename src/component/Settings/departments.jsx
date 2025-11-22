import React, { useState, useEffect } from 'react';
import { Edit2, X, Check, Plus } from 'lucide-react';
import DepEditModal from './Dep_editmodal';
import { fetchDepartments, deleteDepartment, createDepartment, updateDepartment as updateDepartmentApi } from './api/department_api';
import { fetchDashboardData } from '../api/dashboard_api'; // Import the dashboard API
import { t as _t, getLang as _getLang } from '../../i18n/i18n';

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(_getLang() === 'ar' ? 'ar' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    date: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const loadDepartments = async () => {
      const fetchedData = await fetchDashboardData();
      // Map deptNumOfEmp to departments format, assuming name is sufficient; add defaults for missing fields
      const mappedDepartments = fetchedData.deptNumOfEmp.map((dept, index) => ({
        id: index + 1, // Temporary ID since not provided
        name: dept.name,
        manager: 'N/A', // Default since not in API
        date: new Date().toISOString().split('T')[0], // Default date
        numberOfEmp: dept.numberOfEmp
      }));
      setDepartments(mappedDepartments);
    };

    loadDepartments();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setNewDepartment({ name: '', manager: '', date: '' });
  };

  const handleSaveNew = async () => {
    if (newDepartment.name && newDepartment.date) {
      try {
        await createDepartment({
          branchId: 1, // Assuming default branchId, adjust as needed
          name: newDepartment.name,
          date: newDepartment.date
        });

        // Reload departments after creation
        const fetchedDepartments = await fetchDepartments();
        setDepartments(fetchedDepartments);

        setIsAdding(false);
        setNewDepartment({ name: '', manager: '', date: '' });
      } catch (error) {
        console.error('Error saving new department:', error);
        // alert(`Failed to add department: ${error.message}`);
      }
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewDepartment({ name: '', manager: '', date: '' });
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  const updateDepartment = async (updatedDepartment) => {
    const current = departments.find(d => d.id === updatedDepartment.id);
    if (!current) {
      // alert('Department not found.');
      console.error('Department not found.');
      return;
    }

    try {
      await updateDepartmentApi({
        id: updatedDepartment.id,
        branchId: current.branchId,
        name: updatedDepartment.name,
        date: updatedDepartment.date,
        managerId: updatedDepartment.managerId || null
      });

      // Reload departments after update
      const fetchedDepartments = await fetchDepartments();
      setDepartments(fetchedDepartments);

      setIsModalOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Error updating department:', error);
      // alert(`Failed to update department: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        const fetchedDepartments = await fetchDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error('Error deleting department:', error);
        // alert(`Failed to delete department: ${error.message}`);
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
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('MANAGER')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('DATE')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="border-t border-green-200 hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-green-600">
                  {dept.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{dept.manager}</td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(dept.date)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                      title={_t('EDIT')}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title={_t('DELETE')}
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
                    value={newDepartment.name}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={_t('NAME')}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newDepartment.manager}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, manager: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={_t('MANAGER')}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={newDepartment.date}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
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
                <td colSpan={4} className="relative py-6">
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
        <DepEditModal
          department={selectedDepartment}
          onClose={handleCloseModal}
          onSave={updateDepartment}
        />
      )}
    </div>
  );
}
