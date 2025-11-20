import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  X,
  ChevronDown,
  Globe,
  DollarSign,
  LogOut,
  Bell
} from 'lucide-react';
import logo from '../../assets/images/logo.png';
import adminLogo from '../../assets/images/admin_logo.jpg';
import { NotificationModal } from './notification';


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [expandedItems, setExpandedItems] = useState({});
  const [adminData, setAdminData] = useState({ name: 'Loading...', email: '', image: adminLogo });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationButtonRef = useRef(null);
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: FileText, label: 'Requests', path: '/requests' },
    { icon: DollarSign, label: 'Financials', path: '/financials' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Update active item based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check employee-related paths first (more specific)
    if (currentPath === '/employees' || 
        currentPath === '/dashboard-teams' || 
        currentPath === '/employees-action' || 
        currentPath === '/employee-dashboard') {
      setActiveItem('Employees');
    } else if (currentPath === '/dashboard') {
      setActiveItem('Dashboard');
    } else if (currentPath === '/requests') {
      setActiveItem('Requests');
    } else if (currentPath === '/financials') {
      setActiveItem('Financials');
    } else if (currentPath.startsWith('/settings')) {
      // Match any settings route including /settings/workplace
      setActiveItem('Settings');
    }
  }, [location.pathname]);

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('code');
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Fetch admin data on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/admin');
        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();
        setAdminData({
          name: data.name || 'Admin',
          email: data.email || '',
          image: data.data ? data.data : adminLogo
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Fallback to defaults
        setAdminData({ name: 'Admin', email: '', image: adminLogo });
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div 
      className={`${
        isOpen ? 'w-72' : 'w-20'
      } bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header */}
      <div className={`${isOpen ? 'px-6 py-5' : 'px-4 py-5'} flex items-center ${isOpen ? 'justify-between' : 'justify-center'} border-b border-white/10 backdrop-blur-sm`}>
        {isOpen ? (
          <>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-40"></div>
                <div className="relative flex items-center justify-center rounded-2xl bg-white p-2.5 shadow-xl border-2 border-white/50 hover:border-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">HR System</h1>
                <p className="text-xs text-green-100">Management Portal</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:rotate-90"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="relative group"
            aria-label="Open sidebar"
          >
            <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-40"></div>
            <div className="relative flex items-center justify-center rounded-2xl bg-white p-2.5 shadow-xl border-2 border-white/50 hover:border-white transition-all duration-300 hover:scale-105">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.label);
                  } else if (item.path) {
                    handleNavigation(item.path);
                  }
                }}
                className={`w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  activeItem === item.label
                    ? 'bg-white text-green-600 shadow-lg shadow-black/10'
                    : 'hover:bg-white/10 hover:shadow-md'
                }`}
              >
                {/* Active indicator */}
                {activeItem === item.label && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-green-600 rounded-r-full"></div>
                )}
                
                <div className={`flex items-center ${isOpen ? 'gap-3.5' : 'gap-0'}`}>
                  <item.icon 
                    size={22} 
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      activeItem === item.label ? 'scale-110' : 'group-hover:scale-110'
                    }`} 
                  />
                  {isOpen && (
                    <span className={`font-medium text-[15px] ${
                      activeItem === item.label ? 'font-semibold' : ''
                    }`}>
                      {item.label}
                    </span>
                  )}
                </div>
                
                {isOpen && (
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          expandedItems[item.label] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu */}
              {item.children && isOpen && expandedItems[item.label] && (
                <ul className="mt-1.5 ml-5 space-y-1 border-l-2 border-white/10 pl-3">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <button
                        onClick={() => {
                          if (child.path) {
                            handleNavigation(child.path);
                          }
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          activeItem === child.label
                            ? 'bg-white/15 text-white font-semibold shadow-sm'
                            : 'text-green-50 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
                        }`}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-5 border-t border-white/10 backdrop-blur-sm bg-black/5">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full blur-sm opacity-30"></div>
            <img
              src={adminData.image}
              alt="Admin"
              className="relative w-11 h-11 rounded-full ring-2 ring-white/50 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-sm truncate">{adminData.name}</p>
                <div className="flex items-center gap-1">
                  <button 
                    ref={notificationButtonRef}
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Notifications"
                  >
                    <Bell size={15} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9' : unreadCount}
                      </span>
                    )}
                  </button>
                  <button 
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Language"
                  >
                    <Globe size={15} />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-green-100 truncate">{adminData.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        buttonRef={notificationButtonRef}
        receiverCode={localStorage.getItem('code')}
      />
    </div>
  );
}