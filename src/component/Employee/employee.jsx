import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'
import EmployeeListView from './ui/EmployeeListView'
import { Users, Calendar, User } from 'lucide-react'

function Employee() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Employees')

  const tabs = [
    { id: 'Employees', label: 'Employees', icon: User, path: '/employees' },
    { id: 'Work Teams', label: 'Work Teams', icon: Users, path: '/dashboard-teams' },
    { id: 'Employees Action', label: 'Employees Action', icon: Calendar, path: '/employees-action' },
  ]

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname

    if (currentPath === '/employees') {
      setActiveTab('Employees')
    } else if (currentPath === '/dashboard-teams') {
      setActiveTab('Work Teams')
    } else if (currentPath === '/employees-action') {
      setActiveTab('Employees Action')
    }
  }, [location.pathname])

  const handleTabClick = (tab) => {
    setActiveTab(tab.id)
    // navigate to the selected tab route if it's different from current path
    if (location.pathname !== tab.path) {
      navigate(tab.path)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-20 xl:ml-72 transition-all duration-300">
        <div className="p-6 lg:p-8">
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
          </div>
        </div>

        {/* Employee Content */}
        {activeTab === 'Employees' ? (
          <EmployeeListView />
        ) : (
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <p className="text-gray-600">
                {activeTab === 'Work Teams'
                  ? 'Work teams management content goes here...'
                  : 'Employee actions content goes here...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Employee
