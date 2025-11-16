import React, { useState, useEffect } from 'react';
import { Building2, X } from 'lucide-react';
import { fetchEmployees } from './api/employees_api';

export default function DepEditModal({ department, onClose, onSave }) {
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadEmployees = async () => {
      const fetchedEmployees = await fetchEmployees();
      setEmployees(fetchedEmployees);
    };

    loadEmployees();
  }, []); // Fetch employees only once on mount

  useEffect(() => {
    if (department) {
      setName(department.name);
      // Find manager ID from the manager name if it exists
      const managerEmployee = employees.find(emp => emp.name === department.manager);
      setManagerId(managerEmployee?.id || '');
    }
  }, [department, employees]); // Set form values when department or employees change

  const handleSave = () => {
    const updatedDepartment = { 
      ...department, 
      name, 
      managerId: managerId ? Number(managerId) : null 
    };
    onSave(updatedDepartment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
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
        <div className="mb-8">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Department Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder="Enter department name"
          />
        </div>

        {/* Manager Select */}
        <div className="mb-10">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Manager
          </label>
          <select
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
          >
            <option value="">Select Manager</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.position}
              </option>
            ))}
          </select>
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
