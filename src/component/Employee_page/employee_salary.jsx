import React from 'react';
import { DollarSign, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function EmployeeSalaryCard({ salaryData }) {
  if (!salaryData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center text-gray-500">Loading salary details...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Salary Details
          </h3>
          <p className="text-sm text-slate-600 mt-1">Employee Code: {salaryData.empCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Days</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{salaryData.totalDays}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Total Hours</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{salaryData.totalHours.toFixed(1)}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Basic Salary</span>
          </div>
          <div className="text-2xl font-bold text-green-900">${Math.floor(salaryData.basicSalary)}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Current Salary</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">${salaryData.currentSalary.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
