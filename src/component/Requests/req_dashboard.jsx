import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { Search, Calendar, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReqDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Vacation Request');
  const [searchTerm, setSearchTerm] = useState('');

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
    return data.filter(item =>
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleEmployeeClick = (employee) => {
    navigate('/employee-profile', { state: { employee } });
  };

  const renderTable = () => {
    const data = getFilteredData();
    if (activeTab === 'Vacation Request') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100">
            <div className="grid grid-cols-5 gap-4 px-6 py-4">
              <div className="text-green-600 font-semibold">Employee Name</div>
              <div className="text-green-600 font-semibold">Start Date</div>
              <div className="text-green-600 font-semibold">End Date</div>
              <div className="text-green-600 font-semibold">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => handleEmployeeClick(item.employee)}>{item.employeeName}</div>
                <div className="text-gray-600">{item.startDate}</div>
                <div className="text-gray-600">{item.endDate}</div>
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
    } else if (activeTab === 'Advance Request') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100">
            <div className="grid grid-cols-4 gap-4 px-6 py-4">
              <div className="text-green-600 font-semibold">Employee Name</div>
              <div className="text-green-600 font-semibold">Amount</div>
              <div className="text-green-600 font-semibold">Reason</div>
              <div className="text-green-600 font-semibold">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => handleEmployeeClick(item.employee)}>{item.employeeName}</div>
                <div className="text-gray-600">${item.amount}</div>
                <div className="text-gray-600">{item.reason}</div>
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
    } else if (activeTab === 'Over Time') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100">
            <div className="grid grid-cols-4 gap-4 px-6 py-4">
              <div className="text-green-600 font-semibold">Employee Name</div>
              <div className="text-green-600 font-semibold">Hours</div>
              <div className="text-green-600 font-semibold">Date</div>
              <div className="text-green-600 font-semibold">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => handleEmployeeClick(item.employee)}>{item.employeeName}</div>
                <div className="text-gray-600">{item.hours}</div>
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
            <div className="mb-6 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

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
