import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { Search, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

export default function FinancialsDashboard() {
  const [activeTab, setActiveTab] = useState('Salary Management');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'Salary Management', label: 'Salary Management', icon: DollarSign },
    { id: 'Expenses', label: 'Expenses', icon: CreditCard },
    { id: 'Budget', label: 'Budget', icon: TrendingUp }
  ];

  // Sample data for each tab
  const salaryData = [
    { id: 1, employeeName: 'John Doe', salary: 50000, bonus: 5000, status: 'Active' },
    { id: 2, employeeName: 'Jane Smith', salary: 60000, bonus: 6000, status: 'Active' }
  ];

  const expensesData = [
    { id: 1, category: 'Office Supplies', amount: 1500, date: '2023-10-01', status: 'Approved' },
    { id: 2, category: 'Travel', amount: 3000, date: '2023-10-05', status: 'Pending' }
  ];

  const budgetData = [
    { id: 1, department: 'Engineering', allocated: 100000, spent: 75000, remaining: 25000 },
    { id: 2, department: 'Marketing', allocated: 80000, spent: 60000, remaining: 20000 }
  ];

  const getFilteredData = () => {
    let data;
    switch (activeTab) {
      case 'Salary Management':
        data = salaryData;
        break;
      case 'Expenses':
        data = expensesData;
        break;
      case 'Budget':
        data = budgetData;
        break;
      default:
        data = [];
    }
    return data.filter(item =>
      item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderTable = () => {
    const data = getFilteredData();
    if (activeTab === 'Salary Management') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100">
            <div className="grid grid-cols-5 gap-4 px-6 py-4">
              <div className="text-green-600 font-semibold">Employee Name</div>
              <div className="text-green-600 font-semibold">Salary</div>
              <div className="text-green-600 font-semibold">Bonus</div>
              <div className="text-green-600 font-semibold">Total</div>
              <div className="text-green-600 font-semibold">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800">{item.employeeName}</div>
                <div className="text-gray-600">${item.salary}</div>
                <div className="text-gray-600">${item.bonus}</div>
                <div className="text-gray-600">${item.salary + item.bonus}</div>
                <div className="text-gray-600">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeTab === 'Expenses') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100">
            <div className="grid grid-cols-4 gap-4 px-6 py-4">
              <div className="text-green-600 font-semibold">Category</div>
              <div className="text-green-600 font-semibold">Amount</div>
              <div className="text-green-600 font-semibold">Date</div>
              <div className="text-green-600 font-semibold">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800">{item.category}</div>
                <div className="text-gray-600">${item.amount}</div>
                <div className="text-gray-600">{item.date}</div>
                <div className="text-gray-600">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeTab === 'Budget') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100">
            <div className="grid grid-cols-4 gap-4 px-6 py-4">
              <div className="text-green-600 font-semibold">Department</div>
              <div className="text-green-600 font-semibold">Allocated</div>
              <div className="text-green-600 font-semibold">Spent</div>
              <div className="text-green-600 font-semibold">Remaining</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800">{item.department}</div>
                <div className="text-gray-600">${item.allocated}</div>
                <div className="text-gray-600">${item.spent}</div>
                <div className="text-gray-600">${item.remaining}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financials Dashboard</h1>
            <p className="text-gray-600">Manage salaries, expenses, and budgets</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search financials"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {renderTable()}

            {getFilteredData().length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No data found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
