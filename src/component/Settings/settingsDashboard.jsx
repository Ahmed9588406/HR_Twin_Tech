import React, { useState, useEffect } from 'react';
import { Home, Users, FileText, DollarSign, Settings } from 'lucide-react';
import Sidebar from '../ui/Sidebar';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../../i18n/i18n';

export default function SettingsDashboard() {
  const [lang, setLang] = useState(_getLang());
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsub = _subscribe((newLang) => {
      setLang(newLang);
      forceUpdate({}); // Force re-render
    });
    return unsub;
  }, []);

  const TABS = React.useMemo(() => [
    { label: _t('TAB_WORKPLACE'), icon: Home, path: '/settings/workplace' },
    { label: _t('TAB_DEPARTMENTS'), icon: Users, path: '/settings/departments' },
    { label: _t('TAB_POSITIONS'), icon: FileText, path: '/settings/positions' },
    { label: _t('TAB_SHIFTS'), icon: DollarSign, path: '/settings/worktimings' },
    { label: _t('TAB_ATTENDANCE'), icon: Settings, path: '/settings/attendance' },
  ], [lang]); // Re-compute when lang changes

  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const navigate = useNavigate();
  const location = useLocation();
  const [workplaces, setWorkplaces] = useState([]);
  const [attendanceProfiles, setAttendanceProfiles] = useState([]);

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

  // Sync tab with route
  useEffect(() => {
    if (location.pathname === '/settings/workplace') setActiveTab(_t('TAB_WORKPLACE'));
    else if (location.pathname === '/settings/departments') setActiveTab(_t('TAB_DEPARTMENTS'));
    else if (location.pathname === '/settings/positions') setActiveTab(_t('TAB_POSITIONS'));
    else if (location.pathname === '/settings/worktimings') setActiveTab(_t('TAB_SHIFTS'));
    else if (location.pathname === '/settings/attendance') setActiveTab(_t('TAB_ATTENDANCE'));
  }, [location.pathname, lang]); // Add lang dependency

  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
    if (tab.path) {
      navigate(tab.path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 p-6 lg:p-8 overflow-auto ${lang === 'ar' ? 'mr-20 xl:mr-72' : 'ml-20 xl:ml-72'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{_t('SETTINGS_TITLE')}</h1>
            <p className="text-gray-600">{_t('SETTINGS_SUBTITLE')}</p>
          </div>

          {/* Tab Navigation */}
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

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {(location.pathname.startsWith('/settings/')) ? (
              <Outlet context={{ workplaces, updateWorkplaces, attendanceProfiles, updateAttendanceProfiles }} />
            ) : (
              <>
                {/* Placeholders using translated titles */}
                {activeTab === _t('TAB_DEPARTMENTS') && <div>{_t('TAB_DEPARTMENTS')}</div>}
                {activeTab === _t('TAB_POSITIONS') && <div>{_t('TAB_POSITIONS')}</div>}
                {activeTab === _t('TAB_SHIFTS') && <div>{_t('TAB_SHIFTS')}</div>}
                {activeTab === _t('TAB_ATTENDANCE') && <div>{_t('TAB_ATTENDANCE')}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}