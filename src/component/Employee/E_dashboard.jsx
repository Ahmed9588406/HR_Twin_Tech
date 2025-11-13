import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'
import { Users, Calendar, User, CalendarHeart } from 'lucide-react'

function E_dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('Work Teams')

  const tabs = [
    { id: 'Employees', label: 'Employees', icon: User, path: '/employees' },
    { id: 'Work Teams', label: 'Work Teams', icon: Users, path: '/dashboard-teams' },
    { id: 'Employees Action', label: 'Employees Action', icon: Calendar, path: '/employee-dashboard?tab=actions' },
    { id: 'Calender', label: 'Calender', icon: CalendarHeart, path: '/employee-dashboard?tab=calendar' }
  ]

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname
    const queryParams = new URLSearchParams(location.search)
    const tab = queryParams.get('tab')

    if (currentPath === '/employees') {
      setActiveTab('Employees')
    } else if (currentPath === '/dashboard-teams') {
      setActiveTab('Work Teams')
    } else if (tab === 'actions') {
      setActiveTab('Employees Action')
    } else if (tab === 'calendar') {
      setActiveTab('Calender')
    }
  }, [location])

  const handleTabClick = (tab) => {
    navigate(tab.path)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Dashboard</h1>
            <p className="text-gray-600">Manage and monitor employee information</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
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
                )
              })}
            </div>
          </div>

          {/* Tab Content - Only for non-Employees tabs */}
          {activeTab !== 'Employees' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              {activeTab === 'Work Teams' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Work Teams</h2>
                  <p className="text-gray-600">Work teams management content goes here...</p>
                </div>
              )}

              {activeTab === 'Employees Action' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Employees Action</h2>
                  <p className="text-gray-600">Employee actions content goes here...</p>
                </div>
              )}

              {activeTab === 'Calender' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Calender</h2>
                  <p className="text-gray-600">Calendar content goes here...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default E_dashboard

