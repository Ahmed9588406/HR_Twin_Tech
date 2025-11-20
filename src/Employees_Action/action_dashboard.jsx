import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../component/ui/Sidebar';
import { Search, Users, User, Calendar, AlertTriangle, X } from 'lucide-react';
import { fetchBulkActionUsers } from './emp_actions_api'; // added import
import BulkActionsModal from './bulk_Action_form'; // updated import name

export default function ActionDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Employees Action');
  const [actions, setActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActions, setSelectedActions] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const tabs = [
    { id: 'Employees', label: 'Employees', icon: User, path: '/employees' },
    { id: 'Work Teams', label: 'Work Teams', icon: Users, path: '/dashboard-teams' },
    { id: 'Employees Action', label: 'Employees Action', icon: Calendar, path: '/employees-action' },
  ];

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/employees') {
      setActiveTab('Employees');
    } else if (currentPath === '/dashboard-teams') {
      setActiveTab('Work Teams');
    } else if (currentPath === '/employees-action') {
      setActiveTab('Employees Action');
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    if (location.pathname !== tab.path) {
      navigate(tab.path);
    }
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

  const handleBulkActionSuccess = () => {
    setIsBulkModalOpen(false);
    setSelectedActions([]); // Clear selections after success
    // Optionally refresh data
  };

  const filteredActions = actions.filter(action =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employee) => {
    navigate('/employee-profile', { state: { employee } });
  };

  useEffect(() => {
    const loadActions = async () => {
      try {
        const data = await fetchBulkActionUsers();
        // Map to expected structure
        const mapped = data.map(user => ({
          id: user.code,
          name: user.name,
          department: user.departmentName,
          position: user.jobPositionName,
          manager: user.managerName || '-',
          employee: {
            name: user.name,
            role: user.jobPositionName,
            department: user.departmentName,
            avatar: 'https://i.pravatar.cc/150?img=12', // placeholder
            status: 'present', // placeholder
            checkInTime: '09:00' // placeholder
          }
        }));
        setActions(mapped);
      } catch (err) {
        console.error('Failed to load actions:', err);
        // Optionally set error state or show message
      }
    };
    loadActions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-72 transition-all duration-300">
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
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
                    <div className="col-span-3 text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => handleEmployeeClick(action.employee)}>{action.name}</div>
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
        <BulkActionsModal
          selectedActions={selectedActions}
          onClose={handleCloseBulkModal}
          onSuccess={handleBulkActionSuccess}
        />
      )}
    </div>
  );
}