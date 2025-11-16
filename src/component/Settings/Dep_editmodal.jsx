import React, { useState, useEffect, useRef } from 'react';
import { Building2, X, ChevronDown } from 'lucide-react';
import { fetchEmployees } from './api/employees_api';

export default function DepEditModal({ department, onClose, onSave }) {
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      setSelectedEmployee(managerEmployee || null);
    }
  }, [department, employees]); // Set form values when department or employees change

  const handleManagerSelect = (emp) => {
    setManagerId(emp.id);
    setSelectedEmployee(emp);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    const updatedDepartment = { 
      ...department, 
      name, 
      managerId: managerId ? Number(managerId) : null 
    };
    onSave(updatedDepartment);
    onClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-transparent rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] relative">
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

        {/* Manager Dropdown */}
        <div className="mb-10">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            Manager
          </label>
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors cursor-pointer flex items-center justify-between"
            >
              {selectedEmployee ? (
                <div className="flex items-center gap-3">
                  <img
                    src={`data:${selectedEmployee.contentType};base64,${selectedEmployee.image}`}
                    alt={`${selectedEmployee.name} image`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-medium">{selectedEmployee.name}</span>
                    <span className="text-gray-500 ml-2">- {selectedEmployee.position}</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">Select Manager</span>
              )}
              <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div
                  onClick={() => handleManagerSelect(null)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-400"
                >
                  Select Manager
                </div>
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => handleManagerSelect(emp)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={`data:${emp.contentType};base64,${emp.image}`}
                      alt={`${emp.name} image`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-medium">{emp.name}</span>
                      <span className="text-gray-500 ml-2">- {emp.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
