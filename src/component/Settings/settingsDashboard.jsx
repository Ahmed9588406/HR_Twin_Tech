import React, { useState } from 'react';
import { Home, Users, FileText, DollarSign, Settings } from 'lucide-react';
import Sidebar from '../ui/Sidebar';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // Add imports

// Tab labels and icons should match Sidebar menu items for consistency
const TABS = [
  { label: 'Work Place', icon: Home, path: '/settings/workplace' },
  { label: 'Departments', icon: Users, path: '/settings/departments' },
  { label: 'Positions', icon: FileText, path: '/settings/positions' },
  { label: 'Work Timings', icon: DollarSign, path: '/settings/worktimings' },
  { label: 'Attendance Profile', icon: Settings, path: '/settings/attendance' },
];

// Shared workplaces data
const initialWorkplaces = [
  { id: 1, name: 'Alexandria, EG', type: 'Office', company: 'TwinTech', lat: 31.2001, lng: 29.9187 },
  { id: 2, name: 'Saudi Arabia', type: 'Office', company: 'TwinTech', lat: 23.8859, lng: 45.0792 },
  { id: 3, name: 'Agami', type: 'Office', company: 'TwinTech', lat: 31.0409, lng: 29.7714 },
];

// Shared attendance profiles data
const initialAttendanceProfiles = [
  { id: 1, name: 'Alexandria, EG', daysOff: 'Fri', normalWorkTiming: 'Shift: 9 AM - 5 PM' },
  { id: 2, name: 'Saudi Arabia', daysOff: 'Fri', normalWorkTiming: 'Shift: 9 AM - 5 PM' },
  { id: 3, name: 'Agami', daysOff: 'Fri', normalWorkTiming: 'Shift: 9 AM - 5 PM' },
];

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const navigate = useNavigate();
  const location = useLocation();
  const [workplaces, setWorkplaces] = useState(initialWorkplaces);
  const [attendanceProfiles, setAttendanceProfiles] = useState(initialAttendanceProfiles);

  // Function to update workplaces
  const updateWorkplaces = (newWorkplaces) => {
    setWorkplaces(newWorkplaces);
  };

  // Function to update attendance profiles
  const updateAttendanceProfiles = (newProfiles) => {
    setAttendanceProfiles(newProfiles);
  };

  // Navigate to workplace by default when accessing /settings
  React.useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/workplace', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Sync tab with route for Work Place, Departments, Positions, Work Timings, and Attendance Profile
  React.useEffect(() => {
    if (location.pathname === '/settings/workplace') {
      setActiveTab('Work Place');
    } else if (location.pathname === '/settings/departments') {
      setActiveTab('Departments');
    } else if (location.pathname === '/settings/positions') {
      setActiveTab('Positions');
    } else if (location.pathname === '/settings/worktimings') {
      setActiveTab('Work Timings');
    } else if (location.pathname === '/settings/attendance') {
      setActiveTab('Attendance Profile');
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
    if (tab.path) {
      navigate(tab.path);
    }
  };

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
                    onClick={() => handleTabClick(tab)}
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

          {/* Tab Content or Nested Route */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {(location.pathname === '/settings/workplace' || location.pathname === '/settings/departments' || location.pathname === '/settings/positions' || location.pathname === '/settings/worktimings' || location.pathname === '/settings/attendance') ? (
              <Outlet context={{ workplaces, updateWorkplaces, attendanceProfiles, updateAttendanceProfiles }} />
            ) : (
              <>
                {activeTab === 'Departments' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Departments</h2>
                    <p>Department management goes here.</p>
                  </div>
                )}
                {activeTab === 'Positions' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Positions</h2>
                    <p>Position management goes here.</p>
                  </div>
                )}
                {activeTab === 'Work Timings' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Work Timings</h2>
                    <p>Work timings configuration goes here.</p>
                  </div>
                )}
                {activeTab === 'Attendance Profile' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Attendance Profile</h2>
                    <p>Attendance profile settings go here.</p>
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
