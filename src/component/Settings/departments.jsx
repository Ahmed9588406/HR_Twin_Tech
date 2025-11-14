import React, { useState } from 'react';
import { Edit2, X, User, Check, Plus } from 'lucide-react';
import DepEditModal from './Dep_editmodal';

const initialDepartments = [
  { id: 1, name: 'Engineering', manager: 'John Doe', date: '2023-01-15' },
  { id: 2, name: 'Marketing', manager: 'Jane Smith', date: '2023-02-20' },
  { id: 3, name: 'HR', manager: 'Alice Johnson', date: '2023-03-10' },
];

export default function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    date: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleAdd = () => {
    setIsAdding(true);
    setNewDepartment({ name: '', manager: '', date: '' });
  };

  const handleSaveNew = () => {
    if (newDepartment.name && newDepartment.manager && newDepartment.date) {
      const newId = Math.max(...departments.map((dept) => dept.id)) + 1;
      setDepartments([...departments, { ...newDepartment, id: newId }]);
      setIsAdding(false);
      setNewDepartment({ name: '', manager: '', date: '' });
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

  const updateDepartment = (updatedDepartment) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === updatedDepartment.id ? updatedDepartment : dept
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
              <th className="px-6 py-4 text-green-600 font-semibold">Manager</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Date</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Actions</th>
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
                <td className="px-6 py-4 text-gray-500">{dept.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(dept)}
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
                    value={newDepartment.name}
                    onChange={(e) =>
                      setNewDepartment({ ...newDepartment, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Department name"
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
                    placeholder="Manager"
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
                      title="Add Department"
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
