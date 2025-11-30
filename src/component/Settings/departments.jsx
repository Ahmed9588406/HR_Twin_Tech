import React, { useState, useEffect } from 'react';
import { Edit2, X, Check, Plus } from 'lucide-react';
import DepEditModal from './Dep_editmodal';
import { fetchDepartments, deleteDepartment, createDepartment } from './api/department_api';
import { fetchDepartments as fetchDepartmentsFromSettings, fetchBranches } from './api/settings_api';
import { fetchEmployees } from './api/employees_api'; // Add this import
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
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [managers, setManagers] = useState([]);
  const isRtl = _getLang() === 'ar';
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    branchId: '',
    branchName: '',
    date: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch branches and managers on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [branchesData, managersData] = await Promise.all([
          fetchBranches(),
          fetchEmployees()
        ]);
        setBranches(Array.isArray(branchesData) ? branchesData : []);
        setManagers(Array.isArray(managersData) ? managersData : []);
      } catch (error) {
        console.error('Failed to load branches or managers:', error);
        setBranches([]);
        setManagers([]);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      setDepartmentsLoading(true);
      const fetchedData = await fetchDepartmentsFromSettings();
      const mappedDepartments = (fetchedData || []).map((dept) => ({
        id: dept.id,
        name: dept.name,
        branchId: dept.branchId ?? null,
        branchName: dept.branchName || 'N/A',
        managerId: dept.managerId ?? null,
        manager: dept.manager || 'N/A',
        date: dept.date || new Date().toISOString().split('T')[0],
        numberOfEmp: dept.numberOfEmp || 0
      }));
      setDepartments(mappedDepartments);
      setDepartmentsLoading(false);
    };

    loadDepartments();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setNewDepartment({ name: '', branchId: '', branchName: '', date: '' });
  };

  const handleSaveNew = async () => {
    if (newDepartment.name && newDepartment.date && newDepartment.branchId) {
      try {
        setDepartmentsLoading(true);
        await createDepartment({
          branchId: newDepartment.branchId,
          name: newDepartment.name,
          date: newDepartment.date,
          managerId: null
        });

        // Reload departments after creation
        const fetchedDepartments = await fetchDepartmentsFromSettings();
        const mappedDepartments = fetchedDepartments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          branchId: dept.branchId ?? null,
          branchName: dept.branchName || 'N/A',
          managerId: dept.managerId ?? null,
          manager: dept.manager || 'N/A',
          date: dept.date || new Date().toISOString().split('T')[0],
          numberOfEmp: dept.numberOfEmp || 0
        }));
        setDepartments(mappedDepartments);

        setIsAdding(false);
        setNewDepartment({ name: '', branchId: '', branchName: '', date: '' });
      } catch (error) {
        console.error('Failed to create department:', error);
      } finally {
        setDepartmentsLoading(false);
      }
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewDepartment({ name: '', branchId: '', branchName: '', date: '' });
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
    // The modal already made the PUT request and returned the applied object
    // We just need to update local state with it
    if (!updatedDepartment || !updatedDepartment.id) return;

    try {
      // Update local state immediately with the object from modal
      const updatedDepartments = departments.map(d =>
        d.id === updatedDepartment.id ? {
          id: updatedDepartment.id,
          name: updatedDepartment.name,
          branchId: updatedDepartment.branchId,
          branchName: updatedDepartment.branchName,
          managerId: updatedDepartment.managerId,
          manager: updatedDepartment.manager,
          date: updatedDepartment.date,
          numberOfEmp: d.numberOfEmp // preserve existing numberOfEmp
        } : d
      );
      setDepartments(updatedDepartments);
      console.log('Department updated in table:', updatedDepartment);

      setIsModalOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Failed to update department', error);
      alert('Failed to update department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        setDepartmentsLoading(true);
        await deleteDepartment(id);
        const fetchedDepartments = await fetchDepartmentsFromSettings();
        const mappedDepartments = fetchedDepartments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          branchId: dept.branchId ?? null,
          branchName: dept.branchName || 'N/A',
          managerId: dept.managerId ?? null,
          manager: dept.manager || 'N/A',
          date: dept.date || new Date().toISOString().split('T')[0],
          numberOfEmp: dept.numberOfEmp || 0
        }));
        setDepartments(mappedDepartments);
      } catch (error) {
        console.error('Failed to delete department', error);
      } finally {
        setDepartmentsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className={`min-w-full ${isRtl ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('NAME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('BRANCH')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('MANAGER')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('DATE')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold text-center">{_t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {departmentsLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-3" />
                    <div className="text-gray-600">{_t('LOADING')}</div>
                  </div>
                </td>
              </tr>
            ) : null}
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="border-t border-green-200 hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-green-600">
                  {dept.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{dept.branchName}</td> {/* Add Branch cell */}
                <td className="px-6 py-4 text-gray-500">{dept.manager}</td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(dept.date)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                      title={_t('EDIT')}
                      disabled={departmentsLoading}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title={_t('DELETE')}
                      disabled={departmentsLoading}
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
                  <select
                    value={newDepartment.branchId}
                    onChange={(e) => {
                      const selectedBranch = branches.find(b => b.id === parseInt(e.target.value));
                      setNewDepartment({
                        ...newDepartment,
                        branchId: parseInt(e.target.value),
                        branchName: selectedBranch?.name || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">{_t('SELECT_A_BRANCH')}</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  {/* Manager field removed */}
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
                <td colSpan={5} className="relative py-6">
                  <div className="flex justify-center">
                    <button
                      onClick={handleAdd}
                      className="bg-green-400 hover:bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200"
                      title={_t('ADD') || 'Add'}
                      disabled={departmentsLoading}
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
