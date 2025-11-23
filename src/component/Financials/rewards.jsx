import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Gift, Calendar, DollarSign, Edit3, Trash2 } from 'lucide-react';
import { getReward } from './finantial_api';
import EditModalTransaction from './editmodal_transaction';
import DeleteModalTransaction from './DeleteModalTransaction';
import { t as _t, getLang as _getLang } from '../../i18n/i18n';

export default function RewardsDashboard() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReward, setEditingReward] = useState(null);
  const [deletingReward, setDeletingReward] = useState(null);
  const isRtl = _getLang() === 'ar';

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true);
        const data = await getReward();
        setRewards(data);
      } catch (err) {
        console.error('Error loading rewards:', err);
        setError(_t('FAILED_LOAD_REWARDS'));
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  // Filter rewards
  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || reward.status?.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate total rewards
  const totalApproved = rewards.reduce((sum, reward) => sum + reward.amount, 0);

  const handleRowClick = (reward) => {
    navigate('/employee-portal', {
      state: {
        employee: {
          name: reward.name,
          code: reward.code,
          role: 'Employee',
          department: 'General',
          avatar: reward.data ? `data:${reward.contentType};base64,${reward.data}` : 'https://i.pravatar.cc/150?img=12',
          status: 'Stay here',
        },
      },
    });
  };

  const handleEditClick = (reward) => {
    setEditingReward(reward);
  };

  const handleEditSuccess = (updatedReward) => {
    setRewards((prevRewards) =>
      prevRewards.map((reward) =>
        reward.transactionId === updatedReward.transactionId ? updatedReward : reward
      )
    );
    setEditingReward(null);
  };

  const handleDeleteClick = (reward) => {
    setDeletingReward(reward);
  };

  const handleDeleteSuccess = (transactionId) => {
    setRewards((prevRewards) =>
      prevRewards.filter((reward) => reward.transactionId !== transactionId)
    );
    setDeletingReward(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING_REWARDS')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{_t('ERROR_LOADING_DATA')}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('TOTAL')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_REWARDS')}</h3>
          <p className="text-3xl font-bold">{rewards.length}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('APPROVED')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_APPROVED')}</h3>
          <p className="text-3xl font-bold">{totalApproved.toFixed(2)} {_t('CURRENCY')}</p>
        </div>
      </div>

      {/* Rewards Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'direction-rtl' : ''}`}>
            <thead>
              <tr className="bg-green-50 border-b border-green-100">
                <th className={`${isRtl ? 'text-right' : 'text-left'} py-4 px-6 text-sm font-semibold text-green-700`}>{_t('EMPLOYEE_NAME')}</th>
                <th className={`${isRtl ? 'text-right' : 'text-left'} py-4 px-4 text-sm font-semibold text-green-700`}>{_t('REASON_REWARD')}</th>
                <th className={`${isRtl ? 'text-right' : 'text-left'} py-4 px-4 text-sm font-semibold text-green-700`}>{_t('AMOUNT')}</th>
                <th className={`${isRtl ? 'text-right' : 'text-left'} py-4 px-4 text-sm font-semibold text-green-700`}>{_t('REWARD_DATE')}</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-green-700">{_t('ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <tr key={reward.transactionId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={reward.data ? `data:${reward.contentType};base64,${reward.data}` : 'https://i.pravatar.cc/150?img=12'}
                          alt={reward.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <span className="font-medium text-gray-900">{reward.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{reward.description}</td>
                    <td className="py-4 px-4 text-green-600 font-semibold">{reward.amount.toFixed(2)} {_t('CURRENCY')}</td>
                    <td className="py-4 px-4 text-gray-600">{new Date(reward.date).toLocaleDateString(_getLang() === 'ar' ? 'ar' : 'en-US')}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-3">
                        <Edit3
                          className="h-4 w-4 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(reward);
                          }}
                          title={_t('EDIT_AMOUNT')}
                        />
                        <Trash2
                          className="h-4 w-4 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(reward);
                          }}
                          title={_t('DELETE_REWARD')}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Gift className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{_t('NO_DATA_FOUND')}</h3>
                      <p className="text-sm text-gray-500">{_t('TRY_ADJUST_FILTERS')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingReward && (
        <EditModalTransaction
          transaction={editingReward}
          type="reward"
          onClose={() => setEditingReward(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {deletingReward && (
        <DeleteModalTransaction
          transaction={deletingReward}
          type="reward"
          onClose={() => setDeletingReward(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
