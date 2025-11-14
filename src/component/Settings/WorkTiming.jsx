import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import WorkTEditModal from './WorkT_editmodal';

export default function WorkTiming() {
  const { workplaces } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState(null);

  const handleEdit = (timing) => {
    setSelectedTiming(timing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTiming(null);
  };

  const handleSaveTiming = (updatedTiming) => {
    // Placeholder: Implement save logic here (e.g., update workplaces state or API call)
    console.log('Saving updated timing:', updatedTiming);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">Name</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Sign In Range</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Work Hours</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Missing Sign in</th>
              <th className="px-6 py-4 text-green-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workplaces.map((wp) => (
              <tr
                key={wp.id}
                className="border-t border-green-200 hover:bg-green-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-green-600">
                  {wp.name}
                </td>
                <td className="px-6 py-4 text-gray-500">30 min</td>
                <td className="px-6 py-4 text-gray-500">8 hours</td>
                <td className="px-6 py-4 text-gray-500">2 hours</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(wp)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
