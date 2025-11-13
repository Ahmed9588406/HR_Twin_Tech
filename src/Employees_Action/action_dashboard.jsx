import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../component/ui/Sidebar';
import { Search, Users, User, Calendar, Heart, AlertTriangle, X } from 'lucide-react';

export default function ActionDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Employees Action');
  const [actions, setActions] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', position: 'Software Engineer', manager: 'Alice Brown' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Lead', manager: 'Alice Brown' },
    { id: 3, name: 'Bob Johnson', department: 'Sales', position: 'Sales Rep', manager: 'Charlie Davis' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActions, setSelectedActions] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const tabs = [
    { id: 'Employees', label: 'Employees', icon: User, path: '/employees' },
    { id: 'Work Teams', label: 'Work Teams', icon: Users, path: '/dashboard-teams' },
    { id: 'Employees Action', label: 'Employees Action', icon: Calendar, path: '/employees-action' },
    { id: 'Calender', label: 'Calender', icon: Heart, path: '/employee-dashboard?tab=calendar' }
  ];

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');

    if (currentPath === '/employees') {
      setActiveTab('Employees');
    } else if (currentPath === '/dashboard-teams') {
      setActiveTab('Work Teams');
    } else if (currentPath === '/employees-action') {
      setActiveTab('Employees Action');
    } else if (tab === 'calendar') {
      setActiveTab('Calender');
    }
  }, [location]);

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const handleDelete = (id) => {
    setActions(actions.filter(action => action.id !== id));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedActions(filteredActions.map(action => action.id));
    } else {
      setSelectedActions([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedActions(prev =>
      prev.includes(id) ? prev.filter(actionId => actionId !== id) : [...prev, id]
    );
  };

  const handleBulkActions = () => {
    setIsBulkModalOpen(true);
  };

  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
  };

  const handleDeleteSelected = () => {
    setActions(actions.filter(action => !selectedActions.includes(action.id)));
    setSelectedActions([]);
    setIsBulkModalOpen(false);
  };

  const filteredActions = actions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees Action Dashboard</h1>
            <p className="text-gray-600">Manage and monitor employee actions such as promotions, leaves, and warnings</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
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
                  placeholder="Search by name, department, etc."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={handleBulkActions}
                disabled={selectedActions.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertTriangle className="w-5 h-5" />
                Bulk Actions
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="bg-green-50 border-b border-green-100">
                <div className="grid grid-cols-10 gap-4 px-6 py-4 items-center">
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      onChange={handleSelectAll}
                      checked={selectedActions.length > 0 && selectedActions.length === filteredActions.length}
                      indeterminate={selectedActions.length > 0 && selectedActions.length < filteredActions.length}
                    />
                  </div>
                  <div className="col-span-3 text-green-600 font-semibold">Name</div>
                  <div className="col-span-2 text-green-600 font-semibold">Department</div>
                  <div className="col-span-2 text-green-600 font-semibold">Position</div>
                  <div className="col-span-2 text-green-600 font-semibold">Manager</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredActions.map((action) => (
                  <div key={action.id} className={`grid grid-cols-10 gap-4 px-6 py-4 items-center transition-colors ${selectedActions.includes(action.id) ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        checked={selectedActions.includes(action.id)}
                        onChange={() => handleSelectOne(action.id)}
                      />
                    </div>
                    <div className="col-span-3 text-gray-800">{action.name}</div>
                    <div className="col-span-2 text-gray-600">{action.department}</div>
                    <div className="col-span-2 text-gray-600">{action.position}</div>
                    <div className="col-span-2 text-gray-600">{action.manager}</div>
                  </div>
                ))}
              </div>

              {filteredActions.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No actions found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Bulk Actions */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-gray-800">Bulk Actions</h1>
              <button
                onClick={handleCloseBulkModal}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Apply actions to {selectedActions.length} selected employee(s).</p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteSelected}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete Selected
                </button>
                <button
                  onClick={handleCloseBulkModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}