import React, { useState, useEffect, useMemo } from 'react'
import { Users } from 'lucide-react'
import Sidebar from './ui/Sidebar'
import AttendanceCards from './ui/AttendanceCard.jsx'
import AttendanceRate from './ui/Attendance_Rate.jsx'
import Department from './ui/Department.jsx'
import EmployeeCard from './ui/EmployeeCard.jsx' // Changed to use EmployeeCard
import AttendanceHistoryFilter from './ui/Attendance_history.jsx'
import { fetchAttendanceStatistics, fetchDashboardData } from './api/dashboard_api'; // Import the new API function

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    department: 'all',
    status: 'all',
    search: ''
  });

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
    const loadData = async () => {
      try {
        setLoading(true);
        const [dashboard, attendance] = await Promise.all([
          fetchDashboardData(), // Fetch dashboard data from API
          fetchAttendanceStatistics()
        ]);
        setDashboardData(dashboard);
        console.log('Fetched attendance data:', attendance); // Log the fetched attendance data for debugging
        console.log('First employee data:', attendance && attendance.length > 0 ? attendance[0] : 'No data'); // Log first employee to see structure
        setAttendanceData(attendance || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Removed dummyData dependency

  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  // Helper function to get display status
  const getDisplayStatus = (status, leaveTime) => {
    if (leaveTime) return 'Left';
    if (status === 'PRESENT') return 'Stay here';
    if (status === 'ABSENT') return 'Absent';
    if (status === 'ON_LEAVE') return 'Left';
    return 'Stay here';
  };

  // Helper function to map filter status to display status
  const getFilterDisplayStatus = (filterStatus) => {
    if (filterStatus === 'present') return 'Stay here';
    if (filterStatus === 'absent') return 'Absent';
    if (filterStatus === 'on-leave') return 'Left';
    return 'all';
  };

  // Filter attendance data based on active filters
  const filteredEmployees = attendanceData.filter(emp => {
    // Primary filter: Date (always applied)
    if (emp.date && emp.date !== filters.date) {
      return false;
    }
    
    // Secondary filter: Department
    if (filters.department !== 'all' && emp.department !== filters.department) {
      return false;
    }
    
    // Tertiary filter: Status
    if (filters.status !== 'all' && getDisplayStatus(emp.status, emp.leaveTime) !== getFilterDisplayStatus(filters.status)) {
      return false;
    }
    
    // Search filter
    if (filters.search && !emp.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const departments = dashboardData?.deptNumOfEmp?.map(dept => dept.name) || [];

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
                      Showing {filteredEmployees.length} of {attendanceData.length} employees for {new Date(filters.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
                
                {filteredEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredEmployees.map((employee, index) => {
                      console.log('Mapping employee:', employee); // Debug log
                      return (
                        <EmployeeCard 
                          key={employee.empCode || index}
                          employee={{
                            code: employee.empCode,
                            name: employee.empName,
                            role: employee.jobPosition,
                            department: employee.deptartment, // Note: API has 'deptartment' (typo in API?)
                            contentType: employee.contentType,
                            image: employee.empPhoto, // Changed from 'data' to 'empPhoto'
                            checkInTime: employee.arrivalTime,
                            leaveTime: employee.leaveTime, // Add leave time
                            status: employee.leaveTime ? 'Left' : 
                                   (employee.status === 'PRESENT' ? 'Stay here' : 
                                   employee.status === 'ABSENT' ? 'Absent' : 
                                   employee.status === 'ON_LEAVE' ? 'Left' : 
                                   'Stay here')
                          }}
                          showActions={false} // Hide action buttons for dashboard
                        />
                      );
                    })}
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