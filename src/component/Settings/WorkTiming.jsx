import React, { useState, useEffect } from 'react';
import { Edit2, Plus, X } from 'lucide-react';
import WorkTEditModal from './WorkT_editmodal';
import { fetchShifts, deleteShift } from './api/settings_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function WorkTiming() {
  const [shifts, setShifts] = useState([]);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);
  const isRtl = lang === 'ar';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setShiftsLoading(true);
      const data = await fetchShifts();
      if (mounted) {
        setShifts(data || []);
        setShiftsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleDeleteShift = async (id) => {
    const confirmed = window.confirm(_t('DELETE_CONFIRM') || 'Are you sure you want to delete this item?');
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteShift(id);
      setShifts(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete shift:', err);
      alert(err.message || 'Failed to delete shift');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdd = () => {
    if (shiftsLoading) return; // prevent adding while loading
    setSelectedTiming({}); // empty for add
    setIsModalOpen(true);
  };

  const handleEdit = (shift) => {
    if (shiftsLoading) return; // prevent editing while loading
    setSelectedTiming(shift);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTiming(null);
  };

  const handleSaveTiming = (updatedShift) => {
    console.log('Received updated shift:', updatedShift);
    if (updatedShift) {
      setShifts(prevShifts => {
        const existingIndex = prevShifts.findIndex(s => s.id === updatedShift.id);
        if (existingIndex >= 0) {
          // update
          const newShifts = [...prevShifts];
          newShifts[existingIndex] = updatedShift;
          return newShifts;
        } else {
          // add
          return [...prevShifts, updatedShift];
        }
      });
    }
    setIsModalOpen(false);
    setSelectedTiming(null);
  };

  // helper: format time string to "h:mm AM/PM" (12-hour, remove seconds)
  const formatTime = (t) => {
    if (t === null || t === undefined || t === '') return '—';
    const s = String(t).trim();
    // Match "HH:MM:SS" or "HH:MM"
    const match = s.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      let hh = Number(match[1]);
      const mm = match[2];
      const period = hh >= 12 ? 'PM' : 'AM';
      hh = hh % 12 || 12;
      return `${hh}:${mm} ${period}`;
    }
    // Fallback: try Date parsing
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      let hh = d.getHours();
      const mm = String(d.getMinutes()).padStart(2, '0');
      const period = hh >= 12 ? 'PM' : 'AM';
      hh = hh % 12 || 12;
      return `${hh}:${mm} ${period}`;
    }
    return s;
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className={`min-w-full ${isRtl ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('NAME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('START_TIME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('END_TIME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('BRANCH')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('FREE_DAYS')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold text-center">{_t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {shiftsLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-3" />
                    <div className="text-gray-600">{_t('LOADING_SHIFTS')}</div>
                  </div>
                </td>
              </tr>
            ) : shifts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {_t('NO_SHIFTS')}
                </td>
              </tr>
            ) : (
              shifts.map((shift) => (
                <tr key={shift.id} className="border-t border-green-200 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-green-600">
                    {shift.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatTime(shift.start)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatTime(shift.end)}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {/*
                      Prefer normalized branchName from fetchShifts.
                      Fallback to raw payload shapes in case mapping didn't catch it.
                    */}
                    {shift.branchName
                      ?? shift._raw?.branchName
                      ?? shift._raw?.branch?.name
                      ?? shift._raw?.branch?.branchName
                      ?? (shift.branchId ? `Branch ${shift.branchId}` : 'Unknown')}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{shift.freeDays}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleEdit(shift)}
                        className="text-green-400 hover:text-green-600 transition-colors"
                        title={_t('EDIT')}
                        disabled={shiftsLoading || deletingId === shift.id}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteShift(shift.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title={_t('DELETE')}
                        disabled={shiftsLoading || deletingId === shift.id}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/* Empty row for add button */}
            <tr>
              <td colSpan="6" className="relative py-6">
                <div className="flex justify-center">
                  <button
                    onClick={handleAdd}
                    className="bg-green-400 hover:bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200"
                    title={_t('ADD_SHIFT')}
                    disabled={shiftsLoading}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <WorkTEditModal
          timing={selectedTiming}
          onClose={handleCloseModal}
          onSave={handleSaveTiming}
        />
      )}
    </div>
  );
}
