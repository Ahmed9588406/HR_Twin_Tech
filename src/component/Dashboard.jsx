import React, { useState, useEffect, useMemo } from 'react'
import { Users } from 'lucide-react'
import Sidebar from './ui/Sidebar'
import AttendanceCards from './ui/AttendanceCard.jsx'
import AttendanceRate from './ui/Attendance_Rate.jsx'
import Department from './ui/Department.jsx'
import EmployeeCard from './ui/EmployeeCard.jsx'
import AttendanceHistoryFilter from './ui/Attendance_history.jsx'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    department: 'all',
    status: 'all',
    search: ''
  });

  // Dummy data for demonstration
  const dummyData = useMemo(() => ({
    totalEmployees: 150,
    totalAttendaceToday: 142,
    totalAbsentToday: 5,
    totalFreeToday: 3,
    totalDiscount: 12500,
    totalRewards: 8750,
    deptNumOfEmp: [
      { name: "Human Resources", numberOfEmp: 25 },
      { name: "Information Technology", numberOfEmp: 45 },
      { name: "Finance", numberOfEmp: 20 },
      { name: "Marketing", numberOfEmp: 18 },
      { name: "Sales", numberOfEmp: 28 },
      { name: "Operations", numberOfEmp: 22 },
      { name: "Customer Service", numberOfEmp: 15 },
      { name: "Legal", numberOfEmp: 8 },
      { name: "Administration", numberOfEmp: 12 }
    ]
  }), []);

  // Dummy employee data with more details
  const allEmployees = [
    {
      name: "Abdulrahman Ahmed",
      role: "Backend Developer",
      department: "Information Technology",
      avatar: "https://i.pravatar.cc/150?img=12",
      checkInTime: "10:01",
      status: "present",
      date: new Date().toISOString().split('T')[0]
    },
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      department: "Information Technology",
      avatar: "https://i.pravatar.cc/150?img=5",
      checkInTime: "09:45",
      status: "present",
      date: new Date().toISOString().split('T')[0]
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      department: "Marketing",
      avatar: "https://i.pravatar.cc/150?img=8",
      checkInTime: "08:30",
      status: "present",
      date: new Date().toISOString().split('T')[0]
    },
    {
      name: "Emily Rodriguez",
      role: "HR Specialist",
      department: "Human Resources",
      avatar: "https://i.pravatar.cc/150?img=9",
      checkInTime: "09:15",
      status: "present",
      date: new Date().toISOString().split('T')[0]
    },
    {
      name: "David Park",
      role: "Sales Manager",
      department: "Sales",
      avatar: "https://i.pravatar.cc/150?img=13",
      checkInTime: "N/A",
      status: "absent",
      date: new Date().toISOString().split('T')[0]
    },
    {
      name: "Lisa Anderson",
      role: "Accountant",
      department: "Finance",
      avatar: "https://i.pravatar.cc/150?img=14",
      checkInTime: "N/A",
      status: "on-leave",
      date: new Date().toISOString().split('T')[0]
    }
  ];

  useEffect(() => {
    // For demonstration, use dummy data directly
    setDashboardData(dummyData);
    setLoading(false);
  }, [dummyData]);

  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  // Filter employees based on active filters - Date is primary, Department is secondary
  const filteredEmployees = allEmployees.filter(emp => {
    // Primary filter: Date (always applied)
    if (emp.date && emp.date !== filters.date) {
      return false;
    }
    
    // Secondary filter: Department
    if (filters.department !== 'all' && emp.department !== filters.department) {
      return false;
    }
    
    // Tertiary filter: Status
    if (filters.status !== 'all' && emp.status !== filters.status) {
      return false;
    }
    
    // Search filter
    if (filters.search && !emp.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const departments = dummyData.deptNumOfEmp.map(dept => dept.name);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto ml-20 xl:ml-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {dashboardData && (
            <>
              {/* Top Cards */}
              <AttendanceCards data={dashboardData} />
              
              {/* Middle Section - Attendance Rate & Department side by side */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" style={{ minHeight: "500px" }}>
                <div className="w-full h-full">
                  <AttendanceRate data={dashboardData} />
                </div>
                <div className="w-full h-full">
                  <Department data={dashboardData?.deptNumOfEmp} />
                </div>
              </div>

              {/* Attendance Filter - Horizontal Bar */}
              <AttendanceHistoryFilter 
                onFilterChange={handleFilterChange}
                departments={departments}
              />

              {/* Employee Cards Section - Filtered Results */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Employee Attendance</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {filteredEmployees.length} of {allEmployees.length} employees for {new Date(filters.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
                
                {filteredEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredEmployees.map((employee, index) => (
                      <EmployeeCard 
                        key={index}
                        employee={{
                          name: employee.name,
                          role: employee.role,
                          department: employee.department,
                          avatar: employee.avatar,
                          checkInTime: employee.checkInTime,
                          status: employee.status === 'present' ? 'Stay here' : 
                                 employee.status === 'absent' ? 'Absent' : 'On Leave'
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found for this date</h3>
                    <p className="text-sm text-gray-500">Try selecting a different date or adjusting your filters</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;