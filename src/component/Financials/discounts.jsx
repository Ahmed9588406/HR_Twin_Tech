import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingDown, Calendar, DollarSign, X, AlertTriangle } from 'lucide-react';

export default function DiscountsDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const discounts = [
    {
      id: 1,
      employeeName: "nuran abushaqra",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Backend Developer",
      department: "Information Technology",
      reason: "Delay 46m",
      amount: 22.12,
      date: "2025-11-13",
      status: "Applied"
    },
    {
      id: 2,
      employeeName: "Alaa mousa",
      avatar: "https://i.pravatar.cc/150?img=8",
      role: "Frontend Developer",
      department: "Information Technology",
      reason: "Delay 43m",
      amount: 55.13,
      date: "2025-11-13",
      status: "Applied"
    },
    {
      id: 3,
      employeeName: "Habiba Abozaid",
      avatar: "https://i.pravatar.cc/150?img=9",
      role: "UI/UX Designer",
      department: "Information Technology",
      reason: "Delay 27m",
      amount: 43.27,
      date: "2025-11-13",
      status: "Applied"
    },
    {
      id: 4,
      employeeName: "Jaidaa ehab",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Project Manager",
      department: "Management",
      reason: "Absence",
      amount: 615.38,
      date: "2025-11-12",
      status: "Applied"
    },
    {
      id: 5,
      employeeName: "Eslam",
      avatar: "https://i.pravatar.cc/150?img=33",
      role: "Marketing Manager",
      department: "Marketing",
      reason: "Delay 39m",
      amount: 268.27,
      date: "2025-11-12",
      status: "Pending"
    },
    {
      id: 6,
      employeeName: "Habiba Abozaid",
      avatar: "https://i.pravatar.cc/150?img=9",
      role: "UI/UX Designer",
      department: "Information Technology",
      reason: "Delay 168m",
      amount: 269.23,
      date: "2025-11-12",
      status: "Applied"
    },
    {
      id: 7,
      employeeName: "Jaidaa ehab",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Project Manager",
      department: "Management",
      reason: "Absence",
      amount: 615.38,
      date: "2025-11-11",
      status: "Applied"
    },
    {
      id: 8,
      employeeName: "Habiba Abozaid",
      avatar: "https://i.pravatar.cc/150?img=9",
      role: "UI/UX Designer",
      department: "Information Technology",
      reason: "Delay 63m",
      amount: 100.96,
      date: "2025-11-11",
      status: "Applied"
    }
  ];

  // Map employee data for navigation
  const toProfileEmployee = (discount) => ({
    name: discount.employeeName,
    role: discount.role,
    department: discount.department,
    avatar: discount.avatar,
    checkInTime: '10:00',
    status: discount.reason.includes('Absence') ? 'Absent' : 'On break'
  });

  // Filter discounts
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discount.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || discount.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate total discounts
  const totalApplied = discounts.filter(d => d.status === 'Applied')
    .reduce((sum, d) => sum + d.amount, 0);
  const totalPending = discounts.filter(d => d.status === 'Pending')
    .reduce((sum, d) => sum + d.amount, 0);

  const handleRowClick = (discount) => {
    navigate('/employee-portal', { state: { employee: toProfileEmployee(discount) } });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingDown size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Discounts</h3>
          <p className="text-3xl font-bold">{discounts.length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Applied</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Applied</h3>
          <p className="text-3xl font-bold">{totalApplied.toFixed(2)} EGP</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <AlertTriangle size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Pending</h3>
          <p className="text-3xl font-bold">{totalPending.toFixed(2)} EGP</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by employee name or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter & Add Button */}
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer bg-white"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="pending">Pending</option>
            </select>

            <button className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap">
              <span className="hidden sm:inline">Add Discount</span>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:bg-red-100 rounded-full p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                Status: {selectedFilter}
                <button onClick={() => setSelectedFilter('all')} className="hover:bg-orange-100 rounded-full p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                <th className="text-left py-4 px-6 text-sm font-semibold text-red-700">Employee Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-red-700">Reason for discount</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-red-700">the amount</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-red-700">Reward Date</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-red-700">Edit/Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((discount) => (
                  <tr
                    key={discount.id}
                    role="button"
                    tabIndex={0}
                    className="hover:bg-red-50/30 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(discount)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRowClick(discount);
                      }
                    }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={discount.avatar}
                          alt={discount.employeeName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{discount.employeeName}</div>
                          <div className="text-sm text-gray-500">{discount.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {discount.reason.includes('Absence') ? (
                          <X className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-orange-600" />
                        )}
                        <span className={`${
                          discount.reason.includes('Absence') ? 'text-red-600' : 'text-gray-700'
                        } font-medium`}>
                          {discount.reason}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-red-600">{discount.amount.toFixed(2)} EGP</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(discount.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-500 border border-emerald-600 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          Delete
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No discounts found</h3>
                      <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
