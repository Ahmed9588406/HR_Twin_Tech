import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'
import EmployeeListView from './ui/EmployeeListView'
import { Users, Calendar, User, CalendarHeart } from 'lucide-react'

function Employee() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Employees')

  const tabs = [
    { id: 'Employees', label: 'Employees', icon: User, path: '/employees' },
    { id: 'Work Teams', label: 'Work Teams', icon: Users, path: '/employee-dashboard' },
    { id: 'Employees Action', label: 'Employees Action', icon: Calendar, path: '/employee-dashboard?tab=actions' },
    { id: 'Calender', label: 'Calender', icon: CalendarHeart, path: '/employee-dashboard?tab=calendar' }
  ]

  useEffect(() => {
    setActiveTab('Employees')
  }, [])

  const handleTabClick = (tab) => {
    navigate(tab.path)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-20 xl:ml-64 transition-all duration-300">
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

        {/* Employee List Content */}
        <EmployeeListView />
      </div>
    </div>
  )
}

export default Employee
