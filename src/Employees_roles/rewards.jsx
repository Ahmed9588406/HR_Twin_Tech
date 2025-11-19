import React, { useState, useEffect } from 'react';
import { Award, Calendar } from 'lucide-react';
import { fetchEmployeeRewards } from './employee_role_api';

// Constants for hard-coded values
const REWARDS_TITLE = "Rewards & Transactions";
const SUBTITLE = "Recent rewards and bonuses";
const NA_VALUE = "N/A";

export default function EmployeeRewards({ empCode }) {
  const [rewardsData, setRewardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployeeRewards(empCode);
        if (!mounted) return;
        setRewardsData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch rewards data:', err);
        if (!mounted) return;
        setError('Unable to load rewards.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (empCode) {
      loadRewards();
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
          <div className="mt-3">Loading rewards...</div>
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

  if (!rewardsData || rewardsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">No rewards available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            {REWARDS_TITLE}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{SUBTITLE}</p>
        </div>
      </div>

      <div className="space-y-4">
        {rewardsData.map((reward, index) => (
          <div key={reward.transactionId || index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="font-medium text-slate-800">{reward.description || NA_VALUE}</div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {reward.transactionDate ? new Date(reward.transactionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : NA_VALUE}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-600">
                +${reward.amount?.toFixed(2) || NA_VALUE}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
