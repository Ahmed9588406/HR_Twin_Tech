import React, { useState } from 'react';
import { Calendar, Search, Filter, RefreshCw, ChevronDown, X } from 'lucide-react';

/**
 * Attendance History Filter Component - Horizontal Bar
 * 
 * Props:
 *  - onFilterChange (function) - callback when filters change
 *  - departments (array) - list of departments for filtering
 */
export default function AttendanceHistoryFilter({ 
  onFilterChange,
  departments = []
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
    { value: 'present', label: 'Present', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { value: 'absent', label: 'Absent', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
    { value: 'on-leave', label: 'On Leave', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' }
  ];

  const handleFilterChange = (updates) => {
    if (onFilterChange) {
      const newFilters = {
        date: updates.date ?? selectedDate,
        department: updates.department ?? selectedDepartment,
        status: updates.status ?? selectedStatus,
        search: updates.search ?? searchQuery
      };
      onFilterChange(newFilters);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    handleFilterChange({ date: newDate });
  };

  const handleDepartmentChange = (newDept) => {
    setSelectedDepartment(newDept);
    handleFilterChange({ department: newDept });
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSearchQuery('');
    handleFilterChange({ date: today, department: 'all', status: 'all', search: '' });
  };

  const activeFiltersCount = [
    selectedDepartment !== 'all',
    selectedStatus !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  const currentStatus = statusOptions.find(s => s.value === selectedStatus);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Horizontal Filter Bar */}
      <div className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Icon & Title */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 hidden sm:inline">Filters:</span>
          </div>

          {/* Date Picker - Primary Filter */}
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border-2 border-green-500 shadow-sm group">
            <Calendar className="w-4 h-4 text-green-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent text-sm font-semibold text-green-700 border-none outline-none cursor-pointer"
            />
            <span className="text-xs text-green-600 font-medium hidden md:inline">Primary</span>
          </div>

          {/* Department Filter - Secondary */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 hover:border-green-500 px-4 py-2 pr-8 rounded-lg text-sm font-medium text-gray-700 cursor-pointer outline-none transition-all"
            >
              <option value="all">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Quick Filters - Without Late */}
          <div className="flex items-center gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  setSelectedStatus(status.value);
                  handleFilterChange({ status: status.value });
                }}
                className={`
                  px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${selectedStatus === status.value 
                    ? `${status.bgColor} ${status.textColor} ring-2 ring-${status.color}-400 shadow-sm` 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Search - Inline */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange({ search: e.target.value });
              }}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {activeFiltersCount > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {/* Always show selected date as primary filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Filtering by:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border-2 border-green-300">
              <Calendar className="w-3 h-3" />
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {selectedDepartment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {selectedDepartment}
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  handleFilterChange({ department: 'all' });
                }}
                className="hover:bg-blue-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              {currentStatus?.label}
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  handleFilterChange({ status: 'all' });
                }}
                className="hover:bg-purple-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange({ search: '' });
                }}
                className="hover:bg-amber-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

