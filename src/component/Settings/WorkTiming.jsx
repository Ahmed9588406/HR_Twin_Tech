import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import WorkTEditModal from './WorkT_editmodal';
import { fetchShifts } from './api/settings_api';

export default function WorkTiming() {
  const [shifts, setShifts] = useState([]);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState(null);

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
      setShifts(prevShifts => 
        prevShifts.map(s => s.id === updatedShift.id ? updatedShift : s)
      );
    }
    setIsModalOpen(false);
    setSelectedTiming(null);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">Name</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Start Time</th>
              <th className="px-6 py-4 text-green-600 font-semibold">End Time</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Branch</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Free Days</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shiftsLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading shifts...
                </td>
              </tr>
            ) : shifts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No shifts found
                </td>
              </tr>
            ) : (
              shifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="border-t border-green-200 hover:bg-green-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-green-600">
                    {shift.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{shift.start}</td>
                  <td className="px-6 py-4 text-gray-500">{shift.end}</td>
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
                        title="Edit shift"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
