import React, { useState, useEffect } from 'react';
import { MapPin, Edit2, X, Check, Plus } from 'lucide-react';
import EditModal from './editmodal';
import PinModal from './pinmodal';
import { fetchBranches, fetchBranchById, createBranch, deleteBranch } from './api/settings_api';
import { useOutletContext } from 'react-router-dom';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function WorkPlace() {
  const { workplaces, updateWorkplaces } = useOutletContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newWorkplace, setNewWorkplace] = useState({ name: '', type: '', company: '', lat: '', lng: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // language subscription for reactive labels
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const isRtl = lang === 'ar';

  useEffect(() => {
    let mounted = true;
    const loadBranches = async () => {
      // Only load if workplaces is empty to avoid redundant fetches
      if (workplaces.length === 0) {
        setLoading(true);
        try {
          const data = await fetchBranches();
          if (mounted) {
            updateWorkplaces(data || []);
          }
        } catch (err) {
          console.error('Failed to fetch branches:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    };
    loadBranches();
    return () => { mounted = false; };
  }, []); // keep deps minimal to avoid repeated fetches

  const handleAdd = () => {
    setIsAdding(true);
    setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
  };

  const handleSaveNew = async () => {
    if (!newWorkplace.name || !newWorkplace.lat || !newWorkplace.lng) {
      alert(_t('SELECT_LAT_LNG_REQUIRED'));
      return;
    }

    try {
      const lat = parseFloat(newWorkplace.lat);
      const lng = parseFloat(newWorkplace.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        alert(_t('SELECT_LAT_LNG_REQUIRED'));
        return;
      }

      const branchData = {
        name: newWorkplace.name,
        latitude: lat,
        longitude: lng
      };

      const createdBranch = await createBranch(branchData);
      const updatedWorkplaces = [
        ...workplaces,
        {
          id: createdBranch.id,
          name: createdBranch.name,
          lat: createdBranch.latitude,
          lng: createdBranch.longitude,
          type: createdBranch.type,
          company: createdBranch.companyName
        }
      ];
      updateWorkplaces(updatedWorkplaces);
      setIsAdding(false);
      setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
    } catch (error) {
      alert(_t('FAILED_CREATE_BRANCH') + ': ' + (error.message || error));
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewWorkplace({ name: '', type: '', company: '', lat: '', lng: '' });
  };

  const handleEdit = (workplace) => {
    setSelectedWorkplace(workplace);
    setIsModalOpen(true);
  };

  // Accept updated branch from EditModal
  const handleCloseModal = (updated) => {
    setIsModalOpen(false);
    if (updated) {
      // updated: {id, name, latitude, longitude, type, companyName}
      updateWorkplaces((prev) =>
        prev.map((wp) =>
          wp.id === updated.id
            ? {
                id: updated.id,
                name: updated.name,
                lat: updated.latitude,
                lng: updated.longitude,
                type: updated.type,
                company: updated.companyName
              }
            : wp
        )
      );
    }
    setSelectedWorkplace(null);
  };

  // Open pin modal for existing workplace (tag as not-new)
  const handlePin = (workplace) => {
    setSelectedWorkplace({ ...workplace, __isNew: false });
    setIsPinModalOpen(true);
  };

  // Open pin modal for the add-row/new workplace
  const handlePinForNew = () => {
    setSelectedWorkplace({ ...newWorkplace, __isNew: true });
    setIsPinModalOpen(true);
  };

  // Accept optional updated workplace from PinModal
  const handleClosePinModal = (updatedWorkplace) => {
    setIsPinModalOpen(false);

    if (updatedWorkplace) {
      if (updatedWorkplace.__isNew) {
        // fill add-row inputs with picked coords
        setNewWorkplace((prev) => ({
          ...prev,
          lat: updatedWorkplace.lat,
          lng: updatedWorkplace.lng
        }));
      } else {
        // update existing workplace coords in list
        updateWorkplaces((prev) =>
          prev.map((wp) =>
            wp.id === updatedWorkplace.id ? { ...wp, lat: updatedWorkplace.lat, lng: updatedWorkplace.lng } : wp
          )
        );
      }
    }

    setSelectedWorkplace(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(_t('DELETE_CONFIRM'));
    if (!confirmed) return;

    try {
      await deleteBranch(id);
      updateWorkplaces((prev) => prev.filter((wp) => wp.id !== id));
    } catch (error) {
      alert(_t('FAILED_DELETE_WORKPLACE') + ': ' + (error.message || error));
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-green-200 shadow-sm">
        <table className={`min-w-full ${isRtl ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('NAME')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('TYPE')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold">{_t('COMPANY')}</th>
              <th className="px-6 py-4 text-green-600 font-semibold text-center">{_t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-3" />
                    <div className="text-gray-600">{_t('LOADING_WORKPLACES')}</div>
                  </div>
                </td>
              </tr>
            ) : workplaces.length === 0 && !isAdding ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  {_t('NO_WORKPLACES') || 'No workplaces'}
                </td>
              </tr>
            ) : (
              workplaces.map((wp) => (
                <tr
                  key={wp.id}
                  className="border-t border-green-200 hover:bg-green-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-green-600">
                    {wp.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{wp.type}</td>
                  <td className="px-6 py-4 text-gray-500">{wp.company}</td>
                  <td className="px-6 py-4 text-center">
                   <div className="flex items-center justify-center gap-4">
                     <button
                       onClick={() => handlePin(wp)}
                       className="text-gray-500 hover:text-green-600 transition-colors"
                       title={_t('PLACE_PIN_ON_MAP')}
                     >
                       <MapPin size={18} />
                     </button>
                    <button
                      onClick={() => handleEdit(wp)}
                      className="text-green-400 hover:text-green-600 transition-colors"
                      title={_t('EDIT')}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(wp.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title={_t('DELETE')}
                    >
                      <X size={22} />
                    </button>
                  </div>
                </td>
                </tr>
              ))
            )}

            {isAdding && (
              <tr className="border-t border-green-200 bg-green-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newWorkplace.name}
                    onChange={(e) => setNewWorkplace({ ...newWorkplace, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={_t('NAME')}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newWorkplace.type}
                    onChange={(e) => setNewWorkplace({ ...newWorkplace, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={_t('TYPE')}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={newWorkplace.company}
                      onChange={(e) => setNewWorkplace({ ...newWorkplace, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={_t('COMPANY')}
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        step="any"
                        value={newWorkplace.lat}
                        onChange={(e) => setNewWorkplace({ ...newWorkplace, lat: e.target.value })}
                        className="w-1/2 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder={_t('LATITUDE')}
                      />
                      <input
                        type="number"
                        step="any"
                        value={newWorkplace.lng}
                        onChange={(e) => setNewWorkplace({ ...newWorkplace, lng: e.target.value })}
                        className="w-1/2 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder={_t('LONGITUDE')}
                      />
                      <button
                        onClick={handlePinForNew}
                        title={_t('PICK_ON_MAP')}
                        className="ml-2 text-gray-500 hover:text-green-600 transition-colors"
                      >
                        <MapPin size={18} />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={handleSaveNew} className="text-green-600 hover:text-green-800 transition-colors" title={_t('SAVE')}>
                      <Check size={18} />
                    </button>
                    <button onClick={handleCancelAdd} className="text-red-500 hover:text-red-700 transition-colors" title={_t('CANCEL')}>
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isAdding && (
              <tr>
                <td colSpan={4} className="relative py-6">
                  <div className="flex justify-center">
                    <button
                      onClick={handleAdd}
                      className="bg-green-400 hover:bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200"
                      title={_t('ADD_WORKPLACE')}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <EditModal workplace={selectedWorkplace} onClose={handleCloseModal} />}
      {isPinModalOpen && <PinModal workplace={selectedWorkplace} onClose={handleClosePinModal} />}
    </div>
  );
}
