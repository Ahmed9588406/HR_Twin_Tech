import React from 'react';
import { DollarSign, Gift, TrendingDown, MoreVertical, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PayrollDashboard() {
  const navigate = useNavigate();

  const employees = [
    {
      id: 1,
      name: "Abdulrahman Ahmed",
      avatar: "https://i.pravatar.cc/150?img=12",
      totalDays: 26,
      totalHours: 208.0,
      salary: 8000.0,
      rewards: 0.0,
      discounts: 0.0,
      attendanceSalary: 3369.23,
      totalSalary: 3384.62
    },
    {
      id: 2,
      name: "Caroline",
      avatar: "https://i.pravatar.cc/150?img=5",
      totalDays: 26,
      totalHours: 208.0,
      salary: 4000.0,
      rewards: 0.0,
      discounts: 73.08,
      attendanceSalary: 1610.26,
      totalSalary: 1619.23
    },
    {
      id: 3,
      name: "Habiba Abozaid",
      avatar: "https://i.pravatar.cc/150?img=9",
      totalDays: 26,
      totalHours: 208.0,
      salary: 10000.0,
      rewards: 0.0,
      discounts: 1897.44,
      attendanceSalary: 2333.33,
      totalSalary: 2333.33
    },
    {
      id: 4,
      name: "Alaa Mousa",
      avatar: "https://i.pravatar.cc/150?img=8",
      totalDays: 26,
      totalHours: 208.0,
      salary: 8000.0,
      rewards: 0.0,
      discounts: 788.46,
      attendanceSalary: 2888.46,
      totalSalary: 2288.46
    },
    {
      id: 5,
      name: "Jaidaa Ehab",
      avatar: "https://i.pravatar.cc/150?img=1",
      totalDays: 26,
      totalHours: 208.0,
      salary: 8000.0,
      rewards: 0.0,
      discounts: 3347.44,
      attendanceSalary: 1267.95,
      totalSalary: -1808.97
    }
  ];

  // Map payroll employee to Employee_profile format (matching EmployeeCard)
  const toProfileEmployee = (emp) => ({
    name: emp.name,
    role: emp.role || 'Employee',
    department: emp.department || 'General',
    avatar: emp.avatar,
    checkInTime: emp.checkInTime || '10:00',
    // Map status based on financial data
    status: emp.totalSalary < 0 ? 'Absent' : 'Stay here'
  });

  const totalNetPay = 17470.51;
  const totalRewards = 0.0;
  const totalDiscounts = 7630.13;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Net Pay</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Net Pay</h3>
          <p className="text-3xl font-bold">{totalNetPay.toFixed(2)} EGP</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Rewards</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Rewards</h3>
          <p className="text-3xl font-bold">{totalRewards.toFixed(2)} EGP</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingDown size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Discounts</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Discounts</h3>
          <p className="text-3xl font-bold">{totalDiscounts.toFixed(2)} EGP</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Employee</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Days</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Hours</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Salary</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Rewards</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Discounts</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Attendance</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  role="button"
                  tabIndex={0}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate('/employee-portal', { state: { employee: toProfileEmployee(employee) } })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/employee-portal', { state: { employee: toProfileEmployee(employee) } });
                    }
                  }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <span className="font-medium text-gray-900">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{employee.totalDays}</td>
                  <td className="py-4 px-4 text-gray-600">{employee.totalHours}h</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{employee.salary.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm ml-1">EGP</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{employee.rewards.toFixed(2)} EGP</td>
                  <td className="py-4 px-4">
                    <span className={employee.discounts > 0 ? "text-rose-600 font-medium" : "text-gray-600"}>
                      {employee.discounts.toFixed(2)} EGP
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {employee.attendanceSalary.toFixed(2)} EGP
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${employee.totalSalary < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {employee.totalSalary.toFixed(2)} EGP
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); /* open details modal or navigate elsewhere if needed */ }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); /* trigger pay action */ }}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Pay
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); /* open dropdown */ }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="More"
                      >
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}