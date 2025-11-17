import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { updateShift, createShift, fetchBranches } from './api/settings_api';

export default function WorkTEditModal({ timing, onClose, onSave }) {
  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedDays, setSelectedDays] = useState([]); // 0=SUN, 1=MON, ..., 6=SAT
  const [timeZone, setTimeZone] = useState('Africa/Cairo');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Days mapping: 0=SUN, 1=MON, 2=TUE, 3=WED, 4=THU, 5=FRI, 6=SAT
  const DAYS = [
    { label: 'الأحد (SUN)', short: 'SUN', value: 0 },
    { label: 'الإثنين (MON)', short: 'MON', value: 1 },
    { label: 'الثلاثاء (TUE)', short: 'TUE', value: 2 },
    { label: 'الأربعاء (WED)', short: 'WED', value: 3 },
    { label: 'الخميس (THU)', short: 'THU', value: 4 },
    { label: 'الجمعة (FRI)', short: 'FRI', value: 5 },
    { label: 'السبت (SAT)', short: 'SAT', value: 6 }
  ];

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches();
        setBranches(data);
      } catch (err) {
        console.error('Failed to fetch branches:', err);
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    if (!timing) return;
    setName(timing.name ?? '');
    setBranchId(timing.branchId ?? null);
    setStart(timing.start ? String(timing.start) : '');
    setEnd(timing.end ? String(timing.end) : '');
    setTimeZone(timing.timeZone ?? 'Africa/Cairo');
    
    // Convert API days to internal format (0-6)
    // If API uses 7 for Sunday, convert to 0; otherwise use as-is
    setSelectedDays(
      Array.isArray(timing.selectedDays)
        ? timing.selectedDays.map((d) => (d === 7 ? 0 : d))
        : []
    );
    setError(null);
  }, [timing]);

  const toggleDay = (val) => {
    setSelectedDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val].sort((a, b) => a - b)
    );
  };

  const normalizeTime = (t) => {
    if (!t && t !== 0) return '';
    const s = String(t).trim();
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    if (m) return `${m[1].padStart(2,'0')}:${m[2]}:00`;
    const m2 = s.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
    if (m2) return `${m2[1].padStart(2,'0')}:${m2[2]}:${m2[3]}`;
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      const hh = String(d.getHours()).padStart(2,'0');
      const mm = String(d.getMinutes()).padStart(2,'0');
      const ss = String(d.getSeconds()).padStart(2,'0');
      return `${hh}:${mm}:${ss}`;
    }
    return s;
  };

  const handleSave = async () => {
    setError(null);
    if (!name) return setError('Name is required');
    if (!branchId) return setError('branchId is required');
    if (!start || !end) return setError('Start and end are required');

    // Send selectedDays as-is (0-6) to match the table mapping
    const payload = {
      ...(timing?.id ? { id: timing.id } : {}),
      branchId: Number(branchId),
      name: String(name),
      start: normalizeTime(start),
      end: normalizeTime(end),
      selectedDays: selectedDays, // 0=SUN, 1=MON, ..., 6=SAT
      timeZone: timeZone || 'Africa/Cairo'
    };

    setIsSaving(true);
    try {
      const updated = timing?.id ? await updateShift(payload) : await createShift(payload);
      onSave(updated);
      onClose();
    } catch (err) {
      console.error('Failed to save shift:', err);
      setError(err.message || 'Failed to save shift');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={22} />
        </button>

        <h3 className="text-xl font-semibold mb-4">{timing?.id ? 'Edit Shift' : 'Add Shift'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              placeholder="Shift Name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Branch</label>
            <select
              value={branchId || ''}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="" disabled>
                Select a branch
              </option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Start Time</label>
            <input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              placeholder="HH:MM:SS"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Time</label>
            <input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              placeholder="HH:MM:SS"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Time Zone</label>
            <input
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
              placeholder="Africa/Cairo"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Select Working Days</div>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <label
                key={d.value}
                className={`px-3 py-1 rounded-lg border ${
                  selectedDays.includes(d.value)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-200'
                } cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(d.value)}
                  onChange={() => toggleDay(d.value)}
                  className="hidden"
                />
                <span className="text-sm">{d.short}</span>
                <span className="text-xs block opacity-70">{d.label.replace(` (${d.short})`, '')}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : <><Save size={16} /> {timing?.id ? 'Save' : 'Add'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}