import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VacationRequestsTable from './vecation_request'; // Add this import
import AdvanceRequestsTable from './advance_vecation'; // NEW: use advance requests component
import OvertimeRequestsTable from './overtime'; // NEW: use overtime component

export default function ReqDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Vacation Request');

  const tabs = [
    { id: 'Vacation Request', label: 'Vacation Request', icon: Calendar },
    { id: 'Advance Request', label: 'Advance Request', icon: DollarSign },
    { id: 'Over Time', label: 'Over Time', icon: Clock }
  ];

  // Sample data for each tab with employee details
  const vacationRequests = [
    { id: 1, employeeName: 'John Doe', startDate: '2023-10-01', endDate: '2023-10-05', status: 'Pending', employee: { name: 'John Doe', role: 'Software Engineer', department: 'Engineering', avatar: 'https://i.pravatar.cc/150?img=1', status: 'present', checkInTime: '09:00' } },
    { id: 2, employeeName: 'Jane Smith', startDate: '2023-10-10', endDate: '2023-10-12', status: 'Approved', employee: { name: 'Jane Smith', role: 'Marketing Lead', department: 'Marketing', avatar: 'https://i.pravatar.cc/150?img=2', status: 'absent', checkInTime: 'N/A' } }
  ];

  const advanceRequests = [
    { id: 1, employeeName: 'John Doe', amount: 500, reason: 'Medical', status: 'Pending', employee: { name: 'John Doe', role: 'Software Engineer', department: 'Engineering', avatar: 'https://i.pravatar.cc/150?img=1', status: 'present', checkInTime: '09:00' } },
    { id: 2, employeeName: 'Jane Smith', amount: 300, reason: 'Travel', status: 'Approved', employee: { name: 'Jane Smith', role: 'Marketing Lead', department: 'Marketing', avatar: 'https://i.pravatar.cc/150?img=2', status: 'absent', checkInTime: 'N/A' } }
  ];

  const overTimeRequests = [
    { id: 1, employeeName: 'John Doe', hours: 5, date: '2023-10-01', status: 'Pending', employee: { name: 'John Doe', role: 'Software Engineer', department: 'Engineering', avatar: 'https://i.pravatar.cc/150?img=1', status: 'present', checkInTime: '09:00' } },
    { id: 2, employeeName: 'Jane Smith', hours: 3, date: '2023-10-02', status: 'Approved', employee: { name: 'Jane Smith', role: 'Marketing Lead', department: 'Marketing', avatar: 'https://i.pravatar.cc/150?img=2', status: 'absent', checkInTime: 'N/A' } }
  ];

  const getFilteredData = () => {
    let data;
    switch (activeTab) {
      case 'Vacation Request':
        data = vacationRequests;
        break;
      case 'Advance Request':
        data = advanceRequests;
        break;
      case 'Over Time':
        data = overTimeRequests;
        break;
      default:
        data = [];
    }
    return data;
  };

  const handleEmployeeClick = (employee) => {
    navigate('/employee-profile', { state: { employee } });
  };

  const renderTable = () => {
    if (activeTab === 'Vacation Request') {
      return <VacationRequestsTable />; // Use the new component
    } else if (activeTab === 'Advance Request') {
      return <AdvanceRequestsTable />;
    } else if (activeTab === 'Over Time') {
      return <OvertimeRequestsTable />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Requests Dashboard</h1>
            <p className="text-gray-600">Manage employee requests for vacations, advances, and overtime</p>
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
            {renderTable()}

            {getFilteredData().length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No requests found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
