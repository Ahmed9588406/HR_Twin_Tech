import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, RefreshCw, X } from 'lucide-react';

// Mock translation functions for demo
const translations = {
  FILTERS_TITLE: 'Filters',
  PRIMARY: 'Primary',
  ALL_DEPARTMENTS: 'All Departments',
  ALL_STATUS: 'All Status',
  STATUS_PRESENT: 'Present',
  STATUS_ABSENT: 'Absent',
  STATUS_ON_LEAVE: 'On Leave',
  RESET: 'Reset',
  FILTERING_BY: 'Filtering by:',
  SEARCH_PLACEHOLDER: 'Search by name or ID...'
};

const _t = (key) => translations[key] || key;

/**
 * Attendance History Filter Component - Horizontal Bar
 * 
 * Props:
 * - onFilterChange (function) - callback when filters change
 * - departments (array) - list of departments for filtering
 */
export default function AttendanceHistoryFilter({ 
  onFilterChange = () => {}, 
  departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] 
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    { 
      value: 'all', 
      label: _t('ALL_STATUS'), 
      bgColor: 'bg-gray-100', 
      textColor: 'text-gray-700',
      ringColor: 'ring-gray-400'
    },
    { 
      value: 'present', 
      label: _t('STATUS_PRESENT'), 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-700',
      ringColor: 'ring-green-400'
    },
    { 
      value: 'absent', 
      label: _t('STATUS_ABSENT'), 
      bgColor: 'bg-red-100', 
      textColor: 'text-red-700',
      ringColor: 'ring-red-400'
    },
    { 
      value: 'on-leave', 
      label: _t('STATUS_ON_LEAVE'), 
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-700',
      ringColor: 'ring-blue-400'
    }
  ];

  const handleFilterChange = (updates) => {
    const newFilters = {
      date: updates.date ?? selectedDate,
      department: updates.department ?? selectedDepartment,
      status: updates.status ?? selectedStatus,
      search: updates.search ?? searchQuery
    };
    onFilterChange(newFilters);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    handleFilterChange({ date: newDate });
  };

  const handleDepartmentChange = (newDept) => {
    setSelectedDepartment(newDept);
    handleFilterChange({ department: newDept });
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    handleFilterChange({ status: newStatus });
  };

  const handleSearchChange = (newSearch) => {
    setSearchQuery(newSearch);
    handleFilterChange({ search: newSearch });
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSearchQuery('');
    handleFilterChange({ 
      date: today, 
      department: 'all', 
      status: 'all', 
      search: '' 
    });
  };

  const activeFiltersCount = [
    selectedDepartment !== 'all',
    selectedStatus !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  const currentStatus = statusOptions.find(s => s.value === selectedStatus);

  const removeDepartmentFilter = () => {
    setSelectedDepartment('all');
    handleFilterChange({ department: 'all' });
  };

  const removeStatusFilter = () => {
    setSelectedStatus('all');
    handleFilterChange({ status: 'all' });
  };

  const removeSearchFilter = () => {
    setSearchQuery('');
    handleFilterChange({ search: '' });
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Horizontal Filter Bar */}
      <div className="flex items-center gap-4 p-4 flex-wrap">
        {/* Filter Icon & Title */}
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-5 h-5" />
          <span className="font-semibold text-sm">{_t('FILTERS_TITLE')}</span>
        </div>

        {/* Date Picker - Primary Filter */}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border-2 border-green-500 rounded-lg">
          <Calendar className="w-4 h-4 text-green-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-transparent text-sm font-semibold text-green-700 border-none outline-none cursor-pointer"
          />
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
            {_t('PRIMARY')}
          </span>
        </div>

        {/* Department Filter - Secondary */}
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 hover:border-green-500 px-4 py-2 pr-8 rounded-lg text-sm font-medium text-gray-700 cursor-pointer outline-none transition-all"
          >
            <option value="all">{_t('ALL_DEPARTMENTS')}</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Quick Filters */}
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedStatus === status.value
                  ? `${status.bgColor} ${status.textColor} ${status.ringColor} ring-2 shadow-sm`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Search - Inline */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            placeholder={_t('SEARCH_PLACEHOLDER')}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={removeSearchFilter}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {_t('RESET')}
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedDepartment !== 'all' || selectedStatus !== 'all' || searchQuery) && (
        <div className="flex items-center gap-2 px-4 pb-4 flex-wrap">
          <span className="text-xs font-medium text-gray-500">
            {_t('FILTERING_BY')}
          </span>
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>

          {selectedDepartment !== 'all' && (
            <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              {selectedDepartment}
              <button
                onClick={removeDepartmentFilter}
                className="hover:bg-blue-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedStatus !== 'all' && (
            <span className="flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
              {statusOptions.find(s => s.value === selectedStatus)?.label}
              <button
                onClick={removeStatusFilter}
                className="hover:bg-purple-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              "{searchQuery}"
              <button
                onClick={removeSearchFilter}
                className="hover:bg-amber-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}