import React, { useState, useEffect, useRef } from 'react';
import { Building2, X, ChevronDown } from 'lucide-react';
import { fetchEmployees } from './api/employees_api';
import { fetchBranches } from './api/settings_api'; // <-- add import
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function DepEditModal({ department, onClose, onSave }) {
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [lang, setLang] = useState(_getLang());
  const [branchId, setBranchId] = useState('');
  const [branches, setBranches] = useState([]);
  const [date, setDate] = useState(''); // <-- new

  // saving state & error for PUT request
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // store raw server response text for debugging / user visibility
  const [serverResponseText, setServerResponseText] = useState('');

  useEffect(() => _subscribe(setLang), []);

  useEffect(() => {
    const loadEmployees = async () => {
      const fetchedEmployees = await fetchEmployees();
      setEmployees(fetchedEmployees);
    };

    const loadBranches = async () => {
      const fetched = await fetchBranches();
      setBranches(fetched || []);
    };

    loadEmployees();
    loadBranches();
  }, []); // Fetch employees and branches only once on mount

  useEffect(() => {
    if (department) {
      setName(department.name);
      setBranchId(department.branchId ?? '');
      // set date input value (normalize to yyyy-mm-dd if possible)
      const rawDate = department.date || department.dateString || '';
      try {
        setDate(rawDate ? (new Date(rawDate).toISOString().split('T')[0]) : '');
      } catch {
        setDate(rawDate);
      }
      // Find manager ID from the manager name if it exists
      const managerEmployee = employees.find(emp => emp.id === department.managerId) || employees.find(emp => emp.name === department.manager);
      setManagerId(managerEmployee?.id || (department.managerId ?? ''));
      setSelectedEmployee(managerEmployee || (department.manager ? { name: department.manager, id: department.managerId } : null));
    }
  }, [department, employees]); // Set form values when department or employees change

  const handleManagerSelect = (emp) => {
    setManagerId(emp.id);
    setSelectedEmployee(emp);
    setIsDropdownOpen(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    setServerResponseText(''); // clear previous

    // Build payload exactly as backend expects
    const payload = {
      id: Number(department?.id ?? 0),
      branchId: branchId ? Number(branchId) : null,
      name: name || '',
      date: date || department?.date || (new Date().toISOString().split('T')[0]),
      managerId: managerId ? Number(managerId) : null
    };

    // Log the request payload being sent
    console.log('PUT /setting/departments request payload:', JSON.stringify(payload, null, 2));

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('https://api.shl-hr.com/api/v1/setting/departments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'ngrok-skip-browser-warning': 'true',
          'X-Time-Zone': 'Africa/Cairo',
          'Accept-Language': _getLang() || 'en'
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text().catch(() => '');
      // always store raw response text for debugging / UI
      setServerResponseText(text || `${res.status} ${res.statusText}`);
      console.log('PUT /setting/departments response text:', text);

      if (!res.ok) {
        let errMsg = text || `${res.status} ${res.statusText}`;
        try { const j = text ? JSON.parse(text) : null; if (j) errMsg = j.message || j.error || JSON.stringify(j); } catch {}
        throw new Error(errMsg);
      }

      // prefer server-returned department if provided
      let serverData = null;
      try { serverData = text ? JSON.parse(text) : null; } catch { serverData = null; }

      // Map server response to the shape expected by departments.jsx table
      const applied = serverData && serverData.id ? {
         id: serverData.id,
         name: serverData.name ?? payload.name,
         branchId: serverData.branchId ?? payload.branchId,
         branchName: serverData.branchName ?? (branches.find(b => Number(b.id) === Number(payload.branchId))?.name ?? ''),
         managerId: payload.managerId, // server doesn't return managerId, keep what we sent
         manager: serverData.managerName ?? selectedEmployee?.name ?? '', // server returns managerName
         date: serverData.date ?? payload.date
       } : {
         id: payload.id,
         name: payload.name,
         branchId: payload.branchId,
         branchName: branches.find(b => Number(b.id) === Number(payload.branchId))?.name ?? '',
         managerId: payload.managerId,
         manager: selectedEmployee?.name ?? department?.manager ?? '',
         date: payload.date
       };

      console.log('Applied department object to send to parent:', applied);
      if (typeof onSave === 'function') onSave(applied);
      onClose();
    } catch (err) {
      console.error('Save department error', err);
      // if we don't already have server text, put the error message there
      if (!serverResponseText) setServerResponseText(err.message || String(err));
      setSaveError(err.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={_t('CLOSE')}
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
            {_t('DEPARTMENT_NAME')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
            placeholder={_t('ENTER_DEPARTMENT_NAME')}
          />
        </div>

        {/* Branch Name / Branch Selector */}
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            {_t('BRANCH')}
          </label>
          <select
            value={branchId ?? ''}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors bg-white"
          >
            <option value="">{_t('SELECT_A_BRANCH')}</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            {_t('DATE')}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-green-400 focus:outline-none text-lg transition-colors"
          />
        </div>

        {/* Manager Dropdown */}
        <div className="mb-10">
          <label className="block text-gray-500 text-sm font-medium mb-3 tracking-wide">
            {_t('MANAGER')}
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
                <span className="text-gray-400">{_t('SELECT_MANAGER')}</span>
              )}
              <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div
                  onClick={() => handleManagerSelect(null)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-400"
                >
                  {_t('SELECT_MANAGER')}
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

        {/* Save Error */}
        {saveError && (
          <div className="mb-4 text-sm text-red-600">{saveError}</div>
        )}

        {/* Server response (raw) - useful to debug what backend returned */}
        {serverResponseText && (
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2">Server response (raw)</label>
            <pre className="max-h-48 overflow-auto text-xs bg-gray-50 p-3 rounded border border-gray-200">
              {(() => {
                try {
                  // pretty-print JSON if possible
                  const obj = JSON.parse(serverResponseText);
                  return JSON.stringify(obj, null, 2);
                } catch {
                  return serverResponseText;
                }
              })()}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
            disabled={saving}
          >
            {_t('CANCEL')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 text-white rounded-2xl font-semibold shadow-lg transition-all ${saving ? 'bg-green-300 cursor-wait' : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl hover:scale-105'}`}
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block" />
                {_t('SAVING') || 'Saving...'}
              </span>
            ) : _t('SAVE')}
          </button>
        </div>
      </div>
    </div>
  );
}
