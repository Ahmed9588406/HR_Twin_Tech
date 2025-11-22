import React, { useState, useEffect } from 'react';
import { Edit2, Plus } from 'lucide-react';
import WorkTEditModal from './WorkT_editmodal';
import { fetchShifts } from './api/settings_api';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function WorkTiming() {
  const [shifts, setShifts] = useState([]);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [lang, setLang] = useState(_getLang());
  useEffect(() => _subscribe(setLang), []);

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

  const handleAdd = () => {
    setSelectedTiming({}); // empty for add
    setIsModalOpen(true);
  };

  const handleEdit = (shift) => {
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
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('NAME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('START_TIME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('END_TIME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('BRANCH')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('FREE_DAYS')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {shiftsLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {_t('LOADING_SHIFTS')}
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(shift)}
                        className="text-green-400 hover:text-green-600 transition-colors"
                        title={_t('EDIT')}
                      >
                        <Edit2 size={18} />
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
