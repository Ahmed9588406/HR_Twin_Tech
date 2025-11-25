import React, { useState, useEffect } from 'react';
import { t as _t } from '../../i18n/i18n';

const formatCount = (value) => new Intl.NumberFormat().format(value);

const AttendanceCard = ({ count, label, color }) => (
  <div className={`${color} rounded-lg p-4 text-white shadow-lg`}>
    <div className="text-2xl font-bold mb-2">{formatCount(count)}</div>
    <div className="text-base font-medium">{label}</div>
  </div>
);

export default function AttendanceCards({ data }) {
  const [dashboardData, setDashboardData] = useState(data || null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data) {
      fetchDashboardData();
    }
  }, [data]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      setDashboardData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">{_t('LOADING')}</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{_t('ERROR')}: {error}</div>;
  }

  const cards = [
    { count: dashboardData?.totalEmployees || 0, label: _t('EMPLOYEE_SINGULAR'), color: 'bg-blue-600' },
    { count: dashboardData?.totalAttendaceToday || 0, label: _t('ATTENDANCE'), color: 'bg-green-500' },
    { count: dashboardData?.totalAbsentToday || 0, label: _t('ABSENT'), color: 'bg-red-600' },
    { count: dashboardData?.totalFreeToday || 0, label: _t('DAY_OFF_HOLIDAY'), color: 'bg-yellow-500' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <AttendanceCard
          key={index}
          count={card.count}
          label={card.label}
          color={card.color}
        />
      ))}
    </div>
  );
}