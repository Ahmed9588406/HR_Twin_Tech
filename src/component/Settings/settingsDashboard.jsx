import React, { useState } from 'react';
import { Home, Users, FileText, DollarSign, Settings } from 'lucide-react';
import Sidebar from '../ui/Sidebar'; // Add this import

// Tab labels and icons should match Sidebar menu items for consistency
const TABS = [
  { label: 'Work Place', icon: Home },
  { label: 'Departments', icon: Users },
  { label: 'Positions', icon: FileText },
  { label: 'Work Timings', icon: DollarSign },
  { label: 'Attendance Profile', icon: Settings },
];

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0].label);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar /> {/* Add Sidebar here */}
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage system settings and preferences</p>
          </div>

          {/* Tab Navigation - styled like req_dashboard.jsx */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap
                      ${activeTab === tab.label
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
            {activeTab === 'Dashboard' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
                <p>Overview and analytics go here.</p>
              </div>
            )}
            {activeTab === 'Employees' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Employees</h2>
                <p>Employee management and details go here.</p>
              </div>
            )}
            {activeTab === 'Requests' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Requests</h2>
                <p>Requests and approvals go here.</p>
              </div>
            )}
            {activeTab === 'Financials' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Financials</h2>
                <p>Financial reports and payroll go here.</p>
              </div>
            )}
            {activeTab === 'Settings' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Settings</h2>
                <p>System settings and preferences go here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
