import React, { useState } from 'react';
import { X, DollarSign, AlertCircle, Loader2, CheckCircle, Edit3 } from 'lucide-react';

export default function EditModalTransaction({ transaction, type = 'reward', onClose, onSuccess }) {
  const [newAmount, setNewAmount] = useState(transaction.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Auth token not found; please log in again.');
      }

      const response = await fetch(
        `https://api.shl-hr.com/api/v1/financial/${transaction.transactionId}?newAmount=${newAmount}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update ${type}: ${response.status} - ${text}`);
      }

      const updatedTransaction = { ...transaction, amount: newAmount };
      onSuccess(updatedTransaction);
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const title = type === 'discount' ? 'Edit Discount Amount' : 'Edit Reward Amount';
  const gradientColors = type === 'discount' ? 'from-rose-100 to-red-100' : 'from-emerald-100 to-teal-100';
  const buttonColors = type === 'discount' ? 'from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700' : 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradientColors} rounded-full blur-3xl -z-0`} />
        <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${gradientColors} rounded-full blur-3xl -z-0`} />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${buttonColors.split(' ')[0]} rounded-xl shadow-lg`}>
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Update the {type} amount</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:rotate-90 transform group"
            >
              <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>

          {/* Transaction Info */}
          <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Current Amount</span>
              <span className="text-lg font-bold text-emerald-700">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            {transaction.transactionId && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-100">
                <span className="text-xs text-gray-500">Transaction ID</span>
                <span className="text-xs font-mono text-gray-600">{transaction.transactionId}</span>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label htmlFor="newAmount" className="block text-sm font-semibold text-gray-700 mb-2">
              New Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <input
                type="number"
                id="newAmount"
                value={newAmount}
                onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                step="0.01"
                className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all text-lg font-semibold text-gray-900 placeholder-gray-400"
                placeholder="0.00"
              />
            </div>
            {newAmount !== transaction.amount && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                    style={{ width: '100%' }}
                  />
                </div>
                <span className={`font-semibold ${newAmount > transaction.amount ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {newAmount > transaction.amount ? '+' : ''}{(newAmount - transaction.amount).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in slide-in-from-top-2 duration-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-5 py-3.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || newAmount === transaction.amount}
              className={`flex-1 px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-r ${buttonColors} rounded-xl hover:shadow-xl hover:shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <p className="mt-4 text-xs text-center text-gray-500">
            Changes will be applied immediately after saving
          </p>
        </div>
      </div>
    </div>
  );
}