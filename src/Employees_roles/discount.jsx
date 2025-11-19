import React, { useState, useEffect } from 'react';
import { Minus, Calendar } from 'lucide-react';
import { fetchEmployeeDiscounts } from './employee_role_api';

// Constants for hard-coded values
const DISCOUNTS_TITLE = "Discounts & Deductions";
const SUBTITLE = "Recent discounts and penalties";
const NA_VALUE = "N/A";

export default function EmployeeDiscounts({ empCode }) {
  const [discountsData, setDiscountsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadDiscounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployeeDiscounts(empCode);
        if (!mounted) return;
        setDiscountsData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch discounts data:', err);
        if (!mounted) return;
        setError('Unable to load discounts.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (empCode) {
      loadDiscounts();
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [empCode]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto" />
          <div className="mt-3">Loading discounts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!discountsData || discountsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">No discounts available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Minus className="w-5 h-5 text-red-600" />
            {DISCOUNTS_TITLE}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{SUBTITLE}</p>
        </div>
      </div>

      <div className="space-y-4">
        {discountsData.map((discount, index) => (
          <div key={discount.transactionId || index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-3">
              <Minus className="w-6 h-6 text-red-600" />
              <div>
                <div className="font-medium text-slate-800">{discount.description || NA_VALUE}</div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {discount.transactionDate ? new Date(discount.transactionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : NA_VALUE}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Type: {discount.discountType || NA_VALUE}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                -${discount.amount?.toFixed(2) || NA_VALUE}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
