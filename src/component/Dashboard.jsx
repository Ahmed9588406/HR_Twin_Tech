import React, { useState, useEffect, useMemo } from 'react'
import { Users } from 'lucide-react'
import Sidebar from './ui/Sidebar'
import AttendanceCards from './ui/AttendanceCard.jsx'
import AttendanceRate from './ui/Attendance_Rate.jsx'
import Department from './ui/Department.jsx'
import EmployeeCard from './ui/EmployeeCard.jsx'
import AttendanceHistoryFilter from './ui/Attendance_history.jsx'
import { fetchAttendanceStatistics, fetchDashboardData } from './api/dashboard_api'
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n'

function Dashboard() {
  // State management
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

  // Language subscription
  const [lang, setLang] = useState(_getLang());
  useEffect(() => {
    const unsub = _subscribe((newLang) => setLang(newLang));
    return unsub;
  }, []);

  // Initial data load - dashboard data only
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const dashboard = await fetchDashboardData();
        setDashboardData(dashboard);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Fetch attendance data when date or department filter changes
  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        setLoading(true);
        const params = {
          date: filters.date
        };
        
        // Only add department if it's not 'all'
        if (filters.department !== 'all') {
          params.department = filters.department;
        }

        const attendance = await fetchAttendanceStatistics(params);
        setAttendanceData(Array.isArray(attendance) ? attendance : []);
      } catch (err) {
        console.error('Error loading attendance data:', err);
        setError(err.message);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [filters.date, filters.department]);

  // Handle filter changes from the filter component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Helper functions to safely extract employee data
  const getEmpName = (emp) => {
    return String(emp?.name || emp?.empName || emp?.employeeName || '').trim();
  };

  const getEmpCode = (emp) => {
    return String(emp?.empCode || emp?.code || emp?.employeeCode || '').trim();
  };

  const getEmpDepartment = (emp) => {
    return String(emp?.department || emp?.deptartment || emp?.departmentName || emp?.empDepartment || '').trim();
  };

  const getEmpStatus = (emp) => {
    const rawStatus = String(emp?.status || emp?.empStatus || '').toUpperCase().trim();
    const hasArrival = emp?.arrivalTime && emp.arrivalTime !== 'N/A' && emp.arrivalTime !== '';
    const hasLeave = emp?.leaveTime && emp.leaveTime !== 'N/A' && emp.leaveTime !== '';
    
    // Determine status based on various indicators
    // If employee has leave time, they have left
    if (hasLeave) {
      return 'on-leave';
    }
    
    if (/ON[_ -]?LEAVE|LEFT|LEAVE/.test(rawStatus)) {
      return 'on-leave';
    }
    
    if (/ABSENT|APSENT|MISSING/.test(rawStatus) || (!hasArrival && !hasLeave)) {
      return 'absent';
    }
    
    if (/PRESENT|HERE|ON[_ ]?TIME|CHECKED/.test(rawStatus) || hasArrival) {
      return 'present';
    }
    
    return 'present'; // Default
  };

  // Filter employees based on all filter criteria
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return [];
    }

    return attendanceData.filter((emp) => {
      // Status filter (client-side)
      if (filters.status !== 'all') {
        const empStatus = getEmpStatus(emp);
        if (empStatus !== filters.status) {
          return false;
        }
      }

      // Search filter (client-side)
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase().trim();
        const empName = getEmpName(emp).toLowerCase();
        const empCode = getEmpCode(emp).toLowerCase();
        
        if (!empName.includes(searchTerm) && !empCode.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [attendanceData, filters.status, filters.search]);

  // Extract unique departments from dashboard and attendance data
  const departments = useMemo(() => {
    const deptSet = new Set();
    
    // From dashboard data
    if (dashboardData?.deptNumOfEmp) {
      dashboardData.deptNumOfEmp.forEach(dept => {
        const name = String(dept?.name || '').trim();
        if (name) deptSet.add(name);
      });
    }
    
    // From attendance data
    if (Array.isArray(attendanceData)) {
      attendanceData.forEach(emp => {
        const dept = getEmpDepartment(emp);
        if (dept) deptSet.add(dept);
      });
    }
    
    return Array.from(deptSet).sort();
  }, [dashboardData, attendanceData]);

  // Loading and error states
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{_t('LOADING')}</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{_t('ERROR')}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 p-6 lg:p-8 overflow-auto ${lang === 'ar' ? 'mr-20 xl:mr-72' : 'ml-20 xl:ml-72'} transition-all duration-300`}>
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
                    <h2 className="text-xl font-bold text-gray-900">{_t('EMPLOYEE_ATTENDANCE')}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {_t('SHOWING_EMPLOYEES').replace('{{current}}', filteredEmployees.length).replace('{{total}}', attendanceData.length).replace('{{date}}', new Date(filters.date).toLocaleDateString(
                        lang === 'ar' ? 'ar' : 'en-US', 
                        { month: 'long', day: 'numeric', year: 'numeric' }
                      ))}
                    </p>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : filteredEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredEmployees.map((employee, index) => {
                      const empStatus = getEmpStatus(employee);
                      const displayStatus = empStatus === 'on-leave' ? _t('LEFT') :
                                          empStatus === 'absent' ? _t('ABSENT') :
                                          _t('STAY_HERE');
                      
                      return (
                        <EmployeeCard 
                          key={getEmpCode(employee) || index}
                          employee={{
                            code: getEmpCode(employee),
                            name: getEmpName(employee),
                            role: employee.jobPosition || employee.position || '',
                            department: getEmpDepartment(employee),
                            contentType: employee.contentType,
                            image: employee.empPhoto || employee.photo,
                            checkInTime: employee.arrivalTime,
                            leaveTime: employee.leaveTime,
                            status: displayStatus
                          }}
                          showActions={false}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{_t('NO_EMPLOYEES_TITLE')}</h3>
                    <p className="text-sm text-gray-500">{_t('NO_EMPLOYEES_SUB')}</p>
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
