import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Bell, 
  X,
  ChevronDown,
  Search
} from 'lucide-react';
import logo from '../../assets/images/logo.png';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [expandedItems, setExpandedItems] = useState({});

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BarChart3, label: 'Employess', path: '/analytics' },
    { 
      icon: Users, 
      label: 'Team', 
      path: '/team',
      children: [
        { label: 'Members', path: '/team/members' },
        { label: 'Roles', path: '/team/roles' },
        { label: 'Permissions', path: '/team/permissions' }
      ]
    },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-green-500 to-green-600 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl h-screen`}
    >
      {/* Header */}
      <div className={`${isOpen ? 'p-6' : 'p-4'} flex items-center ${isOpen ? 'justify-between' : 'justify-center'} border-b border-green-400/30`}>
        <button
          onClick={toggleSidebar}
          className={`flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-green-400/30 ${isOpen ? 'p-2' : 'p-3'}`}
        >
          <img
            src={logo}
            alt="Logo"
            className={`${isOpen ? 'w-16 h-16' : 'w-12 h-12'} object-contain transition-all duration-300`}
          />
        </button>
        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-green-400/30 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Search */}
      {isOpen && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-100" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-green-400/30 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder-green-100"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  setActiveItem(item.label);
                  if (item.children) {
                    toggleExpand(item.label);
                  }
                }}
                className={`w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activeItem === item.label
                    ? 'bg-white text-green-600 shadow-lg font-semibold'
                    : 'hover:bg-green-400/30'
                }`}
              >
                <div className={`flex items-center ${isOpen ? 'gap-3' : 'gap-0'}`}>
                  <item.icon size={24} className="flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                {isOpen && (
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${
                          expandedItems[item.label] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu */}
              {item.children && isOpen && expandedItems[item.label] && (
                <ul className="mt-1 ml-4 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <button
                        onClick={() => setActiveItem(child.label)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeItem === child.label
                            ? 'bg-green-400/30 text-white font-medium'
                            : 'text-green-50 hover:bg-green-400/20 hover:text-white'
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
      <div className="p-4 border-t border-green-400/30">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-10 h-10 rounded-full ring-2 ring-white"
          />
          {isOpen && (
            <div className="flex-1">
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-green-100">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

