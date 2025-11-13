import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Gift, Calendar, DollarSign, X, Filter, Plus, Edit2, Trash2, Award } from 'lucide-react';

export default function RewardsDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const rewards = [
    {
      id: 1,
      employeeName: "Abdulrahman Ahmed",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Backend Developer",
      department: "Information Technology",
      reason: "Outstanding Performance",
      amount: 1500.0,
      date: "2025-01-15",
      status: "Approved"
    },
    {
      id: 2,
      employeeName: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=45",
      role: "Frontend Developer",
      department: "Information Technology",
      reason: "Project Completion",
      amount: 1200.0,
      date: "2025-01-10",
      status: "Approved"
    },
    {
      id: 3,
      employeeName: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=33",
      role: "Marketing Manager",
      department: "Marketing",
      reason: "Campaign Success",
      amount: 2000.0,
      date: "2025-01-08",
      status: "Pending"
    },
    {
      id: 4,
      employeeName: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=25",
      role: "UI/UX Designer",
      department: "Information Technology",
      reason: "Design Excellence",
      amount: 1000.0,
      date: "2025-01-05",
      status: "Approved"
    }
  ];

  // Map employee data for navigation
  const toProfileEmployee = (reward) => ({
    name: reward.employeeName,
    role: reward.role,
    department: reward.department,
    avatar: reward.avatar,
    checkInTime: '10:00',
    status: 'Stay here'
  });

  // Filter rewards
  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || reward.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate total rewards
  const totalApproved = rewards.filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalPending = rewards.filter(r => r.status === 'Pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleRowClick = (reward) => {
    navigate('/employee-portal', { state: { employee: toProfileEmployee(reward) } });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Rewards</h3>
          <p className="text-3xl font-bold">{rewards.length}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Approved</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Approved</h3>
          <p className="text-3xl font-bold">{totalApproved.toFixed(2)} EGP</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award size={24} />
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
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="flex-1 md:flex-initial px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer bg-white"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>

            <button className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap">
              <Plus size={18} />
              <span className="hidden sm:inline">Add Reward</span>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:bg-green-100 rounded-full p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Status: {selectedFilter}
                <button onClick={() => setSelectedFilter('all')} className="hover:bg-blue-100 rounded-full p-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Rewards Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50 border-b border-green-100">
                <th className="text-left py-4 px-6 text-sm font-semibold text-green-700">Employee Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-green-700">Reason for reward</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-green-700">the amount</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-green-700">Reward Date</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-green-700">Edit/Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <tr
                    key={reward.id}
                    role="button"
                    tabIndex={0}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(reward)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRowClick(reward);
                      }
                    }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={reward.avatar}
                          alt={reward.employeeName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{reward.employeeName}</div>
                          <div className="text-sm text-gray-500">{reward.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{reward.reason}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-green-600">{reward.amount.toFixed(2)} EGP</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(reward.date).toLocaleDateString('en-US', { 
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
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Edit2 size={18} className="text-green-600" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
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
                        <Gift className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards found</h3>
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
