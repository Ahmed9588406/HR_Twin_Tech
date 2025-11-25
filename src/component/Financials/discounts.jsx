import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingDown, Calendar, DollarSign, X, AlertTriangle, Edit3, Trash2 } from 'lucide-react';
import { getDiscounts } from './finantial_api';
import EditModalTransaction from './editmodal_transaction';
import DeleteModalTransaction from './DeleteModalTransaction';
import { t as _t, getLang as _getLang } from '../../i18n/i18n';

export default function DiscountsDashboard({ selectedMonth }) {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deletingDiscount, setDeletingDiscount] = useState(null);

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        setLoading(true);
        const data = await getDiscounts(selectedMonth);
        setDiscounts(data);
      } catch (err) {
        console.error('Error loading discounts:', err);
        setError('Failed to load discounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDiscounts();
  }, [selectedMonth]);

  // Filter discounts
  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch =
      discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || discount.status?.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate total discounts
  const totalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);

  const handleRowClick = (discount) => {
    navigate('/employee-portal', {
      state: {
        employee: {
          name: discount.name,
          code: discount.code,
          role: 'Employee',
          department: 'General',
          avatar: discount.data ? `data:${discount.contentType};base64,${discount.data}` : 'https://i.pravatar.cc/150?img=12',
          status: 'Stay here',
        },
      },
    });
  };

  const handleEditClick = (discount) => {
    setEditingDiscount(discount);
  };

  const handleEditSuccess = (updatedDiscount) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.map((discount) =>
        discount.transactionId === updatedDiscount.transactionId ? updatedDiscount : discount
      )
    );
    setEditingDiscount(null);
  };

  const handleDeleteClick = (discount) => {
    setDeletingDiscount(discount);
  };

  const handleDeleteSuccess = (transactionId) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.filter((discount) => discount.transactionId !== transactionId)
    );
    setDeletingDiscount(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING_DISCOUNTS')}</p>
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
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingDown size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('TOTAL')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_DISCOUNTS')}</h3>
          <p className="text-3xl font-bold">{discounts.length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{_t('AMOUNT')}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">{_t('TOTAL_DISCOUNT_AMOUNT')}</h3>
          <p className="text-3xl font-bold">{totalDiscounts.toFixed(2)} {_t('CURRENCY')}</p>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                <th className="text-left py-4 px-6 text-sm font-semibold text-red-700">{_t('EMPLOYEE_NAME')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-red-700">{_t('REASON_DISCOUNT')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-red-700">{_t('AMOUNT')}</th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-red-700">{_t('DISCOUNT_DATE')}</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-red-700">{_t('ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((discount) => (
                  <tr
                    key={discount.transactionId}
                    className="hover:bg-red-50/30 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(discount)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={discount.data ? `data:${discount.contentType};base64,${discount.data}` : 'https://i.pravatar.cc/150?img=12'}
                          alt={discount.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-red-100 flex-shrink-0"
                        />
                        <span className="font-medium text-gray-900">{discount.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-700 line-clamp-2">{discount.description}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-red-600 font-semibold whitespace-nowrap">
                        {discount.amount.toFixed(2)} {_t('CURRENCY')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-600 whitespace-nowrap">
                        {new Date(discount.date).toLocaleDateString(_getLang() === 'ar' ? 'ar' : 'en-US')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(discount);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title={_t('EDIT_AMOUNT')}
                        >
                          <Edit3 className="h-4 w-4 text-red-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(discount);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title={_t('DELETE_DISCOUNT')}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <TrendingDown className="w-8 h-8 text-gray-400" />
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
      {editingDiscount && (
        <EditModalTransaction
          transaction={editingDiscount}
          type="discount"
          onClose={() => setEditingDiscount(null)}
          onSuccess={handleEditSuccess}
          nonBlocking={true}
        />
      )}

      {/* Delete Modal */}
      {deletingDiscount && (
        <DeleteModalTransaction
          transaction={deletingDiscount}
          type="discount"
          onClose={() => setDeletingDiscount(null)}
          onSuccess={handleDeleteSuccess}
          nonBlocking={true}
        />
      )}
    </div>
  );
}
