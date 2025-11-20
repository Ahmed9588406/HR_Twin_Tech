import React, { useState, useRef, useEffect } from 'react';
import { Percent, X } from 'lucide-react';
import { postDiscountsRewards } from './emp_actions_api';
import { Award,UserRoundMinus  } from 'lucide-react';

const ACTION_TYPES = [
  { value: 'reward', label: 'Reward', icon:<Award/> },
  { value: 'discount', label: 'Discount', icon: <UserRoundMinus/> }
];

const DAYS_OPTIONS = [
  { value: 1, label: 'Half a Day' },
  { value: 2, label: 'One Day' },
  { value: 3, label: 'Two Days' },
  
];

const HOURS_OPTIONS = [
  { value: 1, label: 'Half an Hour' },
  { value: 2, label: 'One Hour' },
  { value: 4, label: 'Two Hours' },
  
];

export default function RewardDiscountForm({ selectedActions = [], onClose = () => {}, onSuccess = () => {} }) {
  const [actionType, setActionType] = useState('');
  const [amountType, setAmountType] = useState(''); // 'AMOUNT', 'NUMOFDAYS', 'NUMOFHOURS'
  const [amount, setAmount] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedHours, setSelectedHours] = useState([]);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // drag state
  const containerRef = useRef(null);
  const [useTransformCenter, setUseTransformCenter] = useState(true);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // drag listeners
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const left = clientX - offset.x;
      const top = clientY - offset.y;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = containerRef.current;
      const w = el ? el.offsetWidth : 600;
      const h = el ? el.offsetHeight : 500;
      const clampedLeft = Math.max(8, Math.min(left, vw - w - 8));
      const clampedTop = Math.max(8, Math.min(top, vh - h - 8));
      setPos({ left: clampedLeft, top: clampedTop });
    };

    const onUp = () => { if (isDragging) setIsDragging(false); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove, { passive: false });
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, offset]);

  const startDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (useTransformCenter) {
      setPos({ left: rect.left, top: rect.top });
      setUseTransformCenter(false);
    }
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
    e.preventDefault();
  };

  const handleAmountTypeChange = (type) => {
    setAmountType(type);
    // Clear other fields when switching type
    if (type === 'AMOUNT') {
      setSelectedDays([]);
      setSelectedHours([]);
    } else if (type === 'NUMOFDAYS') {
      setAmount('');
      setSelectedHours([]);
    } else if (type === 'NUMOFHOURS') {
      setAmount('');
      setSelectedDays([]);
    }
  };

  const handleDaysChange = (value) => {
    const numValue = Number(value);
    setSelectedDays(prev =>
      prev.includes(numValue) ? prev.filter(v => v !== numValue) : [...prev, numValue]
    );
  };

  const handleHoursChange = (value) => {
    const numValue = Number(value);
    setSelectedHours(prev =>
      prev.includes(numValue) ? prev.filter(v => v !== numValue) : [...prev, numValue]
    );
  };

  const validate = () => {
    if (!actionType) {
      setError('Please select an action type.');
      return false;
    }
    if (!amountType) {
      setError('Please select amount type (Amount, Days, or Hours).');
      return false;
    }
    if (amountType === 'AMOUNT' && (!amount || Number(amount) <= 0)) {
      setError('Please enter a valid amount.');
      return false;
    }
    if (amountType === 'NUMOFDAYS' && selectedDays.length === 0) {
      setError('Please select at least one day option.');
      return false;
    }
    if (amountType === 'NUMOFHOURS' && selectedHours.length === 0) {
      setError('Please select at least one hour option.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Build payload matching API shape - always include all fields with null for unused
      let payload = {
        transactionType: actionType.toUpperCase(), // "REWARD" or "DISCOUNT"
        empCodes: selectedActions, // array of numbers
        amount: 0, // default to 0
        numberOfDays: null,
        numberOfHours: null,
        amountType: amountType,
        comment: reason || ''
      };

      if (amountType === 'AMOUNT') {
        payload.amount = parseFloat(amount);
      } else if (amountType === 'NUMOFDAYS') {
        payload.numberOfDays = selectedDays.reduce((a, b) => a + b, 0);
      } else if (amountType === 'NUMOFHOURS') {
        payload.numberOfHours = selectedHours.reduce((a, b) => a + b, 0);
      }

      console.log('Final payload before sending:', payload);

      const result = await postDiscountsRewards(payload);
      console.log('Discounts/Rewards post result:', result);

      const detailMsg = amountType === 'AMOUNT' 
        ? `amount ${amount}`
        : amountType === 'NUMOFDAYS'
        ? `${payload.numberOfDays} days`
        : `${payload.numberOfHours} hours`;

      alert(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} of ${detailMsg} applied to ${selectedActions.length} employee(s).`);
      onSuccess();
    } catch (err) {
      console.error('Discounts/Rewards failed:', err);
      setError(err.message || 'Failed to apply reward/discount. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={containerRef}
        style={
          useTransformCenter
            ? { transform: 'translate(-50%, -50%)', left: '50%', top: '50%', position: 'absolute' }
            : { left: `${pos.left}px`, top: `${pos.top}px`, position: 'absolute' }
        }
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-100 hover:scale-[1.01]"
      >
        {/* Header */}
        <div
          className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 relative overflow-hidden cursor-grab select-none"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Percent className="w-5 h-5 text-white" />
              </div>
              Add Reward or Discount
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Action Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Action Type</label>
            <div className="grid grid-cols-2 gap-3">
              {ACTION_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    actionType === type.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="actionType"
                    value={type.value}
                    checked={actionType === type.value}
                    onChange={(e) => setActionType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount Type</label>
            <div className="grid grid-cols-3 gap-3">
              <label
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  amountType === 'AMOUNT'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="amountType"
                  value="AMOUNT"
                  checked={amountType === 'AMOUNT'}
                  onChange={(e) => handleAmountTypeChange(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium">Amount</span>
              </label>
              <label
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  amountType === 'NUMOFDAYS'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="amountType"
                  value="NUMOFDAYS"
                  checked={amountType === 'NUMOFDAYS'}
                  onChange={(e) => handleAmountTypeChange(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium">Days</span>
              </label>
              <label
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  amountType === 'NUMOFHOURS'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="amountType"
                  value="NUMOFHOURS"
                  checked={amountType === 'NUMOFHOURS'}
                  onChange={(e) => handleAmountTypeChange(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium">Hours</span>
              </label>
            </div>
          </div>

          {/* Amount Input */}
          {amountType === 'AMOUNT' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Days Multi-Select */}
          {amountType === 'NUMOFDAYS' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Days (Total: {selectedDays.reduce((a, b) => a + b, 0)} days)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DAYS_OPTIONS.map((day) => (
                  <label
                    key={day.value}
                    className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDays.includes(day.value)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day.value)}
                      onChange={() => handleDaysChange(day.value)}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Hours Multi-Select */}
          {amountType === 'NUMOFHOURS' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Hours (Total: {selectedHours.reduce((a, b) => a + b, 0)} hours)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {HOURS_OPTIONS.map((hour) => (
                  <label
                    key={hour.value}
                    className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedHours.includes(hour.value)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHours.includes(hour.value)}
                      onChange={() => handleHoursChange(hour.value)}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">{hour.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason (Optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for this action..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Affected Employees */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700">
              <strong>{selectedActions.length}</strong> employee(s) will be affected by this change.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg hover:from-emerald-700 hover:to-green-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Applying...' : `Apply ${actionType || 'Action'} (${selectedActions.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
