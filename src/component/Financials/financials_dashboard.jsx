import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import PayrollDashboard from './payroll';
import RewardsDashboard from './rewards';
import DiscountsDashboard from './discounts';
import { Search, DollarSign, Award, TrendingDown, PieChart } from 'lucide-react'; // Add PieChart icon
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function FinancialsDashboard() {
  const [activeTab, setActiveTab] = useState('PayRoll');
  const [searchTerm, setSearchTerm] = useState('');
  const [lang, setLang] = useState(_getLang());
  React.useEffect(() => _subscribe(setLang), []);

  const tabs = [
    { id: 'PayRoll', label: _t('TAB_PAYROLL'), icon: DollarSign },
    { id: 'Rewards', label: _t('TAB_REWARDS'), icon: Award },
    { id: 'Discount', label: _t('TAB_DISCOUNT'), icon: TrendingDown },
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
              <div className="text-green-600 font-semibold">{_t('EMPLOYEE_NAME')}</div>
              <div className="text-green-600 font-semibold">{_t('SALARY')}</div>
              <div className="text-green-600 font-semibold">{_t('BONUS')}</div>
              <div className="text-green-600 font-semibold">{_t('TOTAL')}</div>
              <div className="text-green-600 font-semibold">{_t('STATUS')}</div>
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
                    {item.status === 'Active' ? _t('ACTIVE') : item.status}
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
              <div className="text-green-600 font-semibold">{_t('CATEGORY')}</div>
              <div className="text-green-600 font-semibold">{_t('AMOUNT')}</div>
              <div className="text-green-600 font-semibold">{_t('DATE')}</div>
              <div className="text-green-600 font-semibold">{_t('STATUS')}</div>
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
                    {item.status === 'Approved' ? _t('APPROVED') : item.status === 'Pending' ? _t('PENDING') : item.status}
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
              <div className="text-green-600 font-semibold">{_t('DEPARTMENT_COL')}</div>
              <div className="text-green-600 font-semibold">{_t('ALLOCATED')}</div>
              <div className="text-green-600 font-semibold">{_t('SPENT')}</div>
              <div className="text-green-600 font-semibold">{_t('REMAINING_COL')}</div>
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

  const renderContent = () => {
    if (activeTab === 'PayRoll') {
      return <PayrollDashboard />;
    }
    if (activeTab === 'Rewards') {
      return <RewardsDashboard />;
    }
    if (activeTab === 'Discount') {
      return <DiscountsDashboard />;
    }
    // For other tabs, keep existing table logic or add placeholder
    return renderTable();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 p-6 lg:p-8 overflow-auto ${lang === 'ar' ? 'mr-20 xl:mr-72' : 'ml-20 xl:ml-72'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{_t('FINANCIALS_DASHBOARD')}</h1>
            <p className="text-gray-600">{_t('FINANCIALS_SUBTITLE')}</p>
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
            {activeTab === 'PayRoll' || activeTab === 'Rewards' || activeTab === 'Discount' ? (
              renderContent()
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={_t('SEARCH_FINANCIALS')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                {renderContent()}
                {getFilteredData().length === 0 && (
                  <div className="px-6 py-12 text-center text-gray-500">
                    {_t('NO_DATA_FOUND')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
