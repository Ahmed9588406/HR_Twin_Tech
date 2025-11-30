import React, { useState, useEffect } from 'react';
import { Award, Calendar, AlertCircle } from 'lucide-react';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n';
import { fetchEmployeeRewards } from './employee_role_api';

const TEXT = {
  en: {
    rewardsTitle: 'Rewards',
    rewardsSubtitle: 'Your recent rewards',
    na: 'N/A',
    loading: 'Loading rewards...',
    noRewards: 'No rewards found',
    error: 'Failed to load rewards'
  },
  ar: {
    rewardsTitle: 'المكافآت',
    rewardsSubtitle: 'مكافآتك الحديثة',
    na: 'غير متوفر',
    loading: 'جاري التحميل...',
    noRewards: 'لم يتم العثور على مكافآت',
    error: 'فشل في تحميل المكافآت'
  }
};

// Loading Skeleton Component
const RewardsLoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-16"></div>
      </div>
    ))}
  </div>
);

export default function EmployeeRewards({ empCode }) {
  const [lang, setLang] = useState(_getLang());
  const [rewardsData, setRewardsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  // Fetch rewards data when empCode changes
  useEffect(() => {
    if (!empCode) return;

    const fetchRewards = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEmployeeRewards(empCode);
        
        // Handle array response or nested data structure
        const rewards = Array.isArray(data) ? data : (data?.content || data?.data || []);
        setRewardsData(Array.isArray(rewards) ? rewards : []);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError(err.message || 'Failed to load rewards');
        setRewardsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [empCode]);

  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const NA_VALUE = copy.na;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200" dir={dir} lang={lang}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            {copy.rewardsTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{copy.rewardsSubtitle}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && <RewardsLoadingSkeleton />}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{copy.error}: {error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && rewardsData.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{copy.noRewards}</p>
        </div>
      )}

      {/* Rewards List */}
      {!loading && !error && rewardsData.length > 0 && (
        <div className="space-y-4">
          {rewardsData.map((reward, index) => (
            <div key={reward.transactionId || index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 flex-1">
                <Award className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-800">
                    {lang === 'ar' && reward.descriptionAr ? reward.descriptionAr : (reward.description || NA_VALUE)}
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {reward.transactionDate 
                      ? new Date(reward.transactionDate).toLocaleDateString(
                          lang === 'ar' ? 'ar-SA' : 'en-US', 
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )
                      : NA_VALUE
                    }
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-yellow-600">
                  +{typeof reward.amount === 'number' ? reward.amount.toFixed(2) : NA_VALUE}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
