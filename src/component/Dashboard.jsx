import React, { useState, useEffect, useMemo } from 'react'
import { Users } from 'lucide-react'
import Sidebar from './ui/Sidebar'
import AttendanceCards from './ui/AttendanceCard.jsx'
import AttendanceRate from './ui/Attendance_Rate.jsx'
import Department from './ui/Department.jsx'
import EmployeeCard from './ui/EmployeeCard.jsx' // Changed to use EmployeeCard
import AttendanceHistoryFilter from './ui/Attendance_history.jsx'
import { fetchAttendanceStatistics, fetchDashboardData } from './api/dashboard_api'; // Import the new API function
import { t as _t, getLang as _getLang, subscribe as _subscribe } from '../i18n/i18n'

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

  const [lang, setLang] = useState(_getLang());
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsub = _subscribe((newLang) => {
      setLang(newLang);
      forceUpdate({}); // Force re-render
    });
    return unsub;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dashboard, attendance] = await Promise.all([
          fetchDashboardData(), // Fetch dashboard data from API
          fetchAttendanceStatistics({ date: filters.date, department: filters.department })
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
  }, []); 

  useEffect(() => {
    const refetchAttendance = async () => {
      try {
        setLoading(true);
        const attendance = await fetchAttendanceStatistics({ date: filters.date, department: filters.department });
        setAttendanceData(attendance || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    refetchAttendance();
  }, [filters.date, filters.department]);

  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    const str = String(value).trim();
    // If already like 2025-11-02 or 2025/11/02
    if (/^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(str)) {
      const parts = str.includes('-') ? str.split('-') : str.split('/');
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    // If like 02/11/2025
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [dd, mm, yyyy] = str.split('/');
      return `${yyyy}-${mm}-${dd}`;
    }
    try {
      const d = new Date(str);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return null;
    }
  };

  const getEmpDepartment = (emp) => {
    const dept = emp.department || emp.deptartment || emp.departmentName || emp.empDepartment || '';
    return String(dept).trim();
  };

  const getEmpName = (emp) => {
    return String(emp.name || emp.empName || emp.employeeName || '').trim();
  };

  const getEmpCode = (emp) => {
    return String(emp.empCode || emp.code || emp.employeeCode || '').trim();
  };

  const getEmpStatusNorm = (emp) => {
    const raw = String(emp.status || emp.empStatus || '').toUpperCase().trim();
    const hasLeave = !!(emp.leaveTime && emp.leaveTime !== 'N/A');
    if (hasLeave) return 'on-leave';
    if (/PRESENT|HERE|ON_TIME/.test(raw)) return 'present';
    if (/ABSENT|MISSING/.test(raw)) return 'absent';
    if (/ON[_ ]?LEAVE|LEFT|LEAVE/.test(raw)) return 'on-leave';
    return 'present';
  };

  const filteredEmployees = attendanceData.filter(emp => {
    const empDateRaw = emp.date || emp.attendanceDate || emp.attendance_date || null;
    const empDate = empDateRaw ? normalizeDate(String(empDateRaw).split('T')[0]) : null;
    const filterDate = filters.date ? normalizeDate(String(filters.date).split('T')[0]) : null;

    // If a date is selected, require the employee record to match that exact date
    if (filterDate) {
      if (!empDate || empDate !== filterDate) return false;
    }

    if (filters.department !== 'all') {
      const empDept = getEmpDepartment(emp).toLowerCase();
      const selDept = String(filters.department).toLowerCase();
      if (empDept !== selDept) return false;
    }

    if (filters.status !== 'all') {
      const empStatus = getEmpStatusNorm(emp);
      if (empStatus !== filters.status) return false;
    }

    if (filters.search) {
      const empName = getEmpName(emp).toLowerCase();
      const empCode = getEmpCode(emp).toLowerCase();
      const term = String(filters.search).toLowerCase();
      if (!empName.includes(term) && !empCode.includes(term)) return false;
    }

    return true;
  });

  const departments = useMemo(() => {
    const fromDashboard = dashboardData?.deptNumOfEmp?.map(dept => String(dept.name).trim()) || [];
    const fromAttendance = Array.from(new Set((attendanceData || []).map(e => getEmpDepartment(e)).filter(Boolean)));
    const set = new Set([...(fromDashboard || []), ...(fromAttendance || [])]);
    return Array.from(set);
  }, [dashboardData, attendanceData]);

  if (loading) return <div className="flex items-center justify-center h-screen">{_t('LOADING')}</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

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
                      {_t('SHOWING_EMPLOYEES', { current: filteredEmployees.length, total: attendanceData.length, date: new Date(filters.date).toLocaleDateString(_getLang() === 'ar' ? 'ar' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }) })}
                    </p>
                  </div>
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
                            name: getEmpName(employee),
                            role: employee.jobPosition,
                            department: getEmpDepartment(employee), // Note: API has 'deptartment' (typo in API?)
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