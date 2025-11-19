import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Award, Minus } from 'lucide-react';
import { fetchEmployeeSalary } from './employee_role_api';

// Constants for hard-coded values
const SALARY_TITLE = "Salary Details";
const SUBTITLE = "Financial summary";
const NA_VALUE = "N/A";
const LABELS = {
  TOTAL_SALARY: "Total Salary",
  FIXED_SALARY: "Fixed Salary",
  TOTAL_HOURS: "Total Hours",
  TOTAL_DAYS: "Total Days",
  REWARDS: "Rewards",
  DISCOUNTS: "Discounts"
};

export default function EmployeeSalary({ empCode }) {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadSalary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEmployeeSalary(empCode);
        if (!mounted) return;
        setSalaryData(data);
      } catch (err) {
        console.error('Failed to fetch salary data:', err);
        if (!mounted) return;
        setError('Unable to load salary details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (empCode) {
      loadSalary();
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
          <div className="mt-3">Loading salary...</div>
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

  if (!salaryData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">No salary data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            {SALARY_TITLE}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{SUBTITLE}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-slate-700">{LABELS.TOTAL_SALARY}</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${salaryData.totalSalary?.toFixed(2) || NA_VALUE}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">{LABELS.FIXED_SALARY}</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ${salaryData.fixedSalary?.toFixed(2) || NA_VALUE}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">{LABELS.TOTAL_HOURS}</span>
          </div>
          <div className="text-lg font-bold text-purple-600">
            {salaryData.totalHours || NA_VALUE}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">{LABELS.TOTAL_DAYS}</span>
          </div>
          <div className="text-lg font-bold text-orange-600">
            {salaryData.totalDays || NA_VALUE}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-slate-700">{LABELS.REWARDS}</span>
          </div>
          <div className="text-lg font-bold text-yellow-600">
            {salaryData.numberOfRewards || 0}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-slate-700">{LABELS.DISCOUNTS}</span>
          </div>
          <div className="text-lg font-bold text-red-600">
            {salaryData.numberOfDiscounts || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
