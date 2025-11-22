import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, X, MapPin, Building } from "lucide-react";
import EmployeeCard from "../../ui/EmployeeCard";
import CreateNewEmployee from "../../Employee_page/Create_new_Employee"; // Import the modal
import { fetchEmployeeById } from "../../Settings/api/employees_api"; // Import the API function
import { useNavigate } from "react-router-dom";
import { fetchEmployees, deleteEmployee, lockEmployee } from '../../Employee_page/api/emplyee_api'; // Added lockEmployee import
import { fetchBranches, fetchDepartments } from '../../Settings/api/settings_api' // fetch lists for filters
import { getLang as _getLang, subscribe as _subscribe } from '../../../i18n/i18n';

const TEXT = {
  en: {
    filterEmployees: 'Filter Employees',
    searchByName: 'Search by Name',
    enterEmployeeName: 'Enter employee name...',
    department: 'Department',
    allDepartments: 'All Departments',
    officeLocation: 'Office Location',
    allLocations: 'All Locations',
    activeFilters: 'Active filters:',
    search: 'Search:',
    clearAll: 'Clear All',
    total: 'Total',
    present: 'Present',
    onLeave: 'On Leave',
    absent: 'Absent',
    loadingEmployees: 'Loading employees...',
    error: 'Error:',
    retry: 'Retry',
    noEmployeesFound: 'No employees found',
    tryAdjusting: 'Try adjusting your search or filters',
    confirmDelete: 'Are you sure you want to delete',
    deleteAction: 'This action cannot be undone.',
    deleteSuccess: 'Employee deleted successfully!',
    deleteError: 'Error deleting employee:',
    confirmLock: 'Are you sure you want to',
    unlock: 'unlock',
    lock: 'lock',
    lockSuccess: 'has been',
    lockError: 'Error:',
    noEmail: 'No email available for this employee.',
    noPhone: 'No phone number available for this employee.',
    employeeInfo: 'Employee Info:\nName:',
    email: 'Email:',
    phone: 'Phone:',
    na: 'N/A'
  },
  ar: {
    filterEmployees: 'تصفية الموظفين',
    searchByName: 'البحث بالاسم',
    enterEmployeeName: 'أدخل اسم الموظف...',
    department: 'القسم',
    allDepartments: 'جميع الأقسام',
    officeLocation: 'موقع المكتب',
    allLocations: 'جميع المواقع',
    activeFilters: 'الفلاتر النشطة:',
    search: 'البحث:',
    clearAll: 'مسح الكل',
    total: 'المجموع',
    present: 'حاضر',
    onLeave: 'في إجازة',
    absent: 'غائب',
    loadingEmployees: 'جارٍ تحميل الموظفين...',
    error: 'خطأ:',
    retry: 'إعادة المحاولة',
    noEmployeesFound: 'لم يتم العثور على موظفين',
    tryAdjusting: 'جرب تعديل البحث أو الفلاتر',
    confirmDelete: 'هل أنت متأكد من أنك تريد حذف',
    deleteAction: 'لا يمكن التراجع عن هذا الإجراء.',
    deleteSuccess: 'تم حذف الموظف بنجاح!',
    deleteError: 'خطأ في حذف الموظف:',
    confirmLock: 'هل أنت متأكد من أنك تريد',
    unlock: 'إلغاء القفل',
    lock: 'القفل',
    lockSuccess: 'تم',
    lockError: 'خطأ:',
    noEmail: 'لا يوجد بريد إلكتروني متاح لهذا الموظف.',
    noPhone: 'لا يوجد رقم هاتف متاح لهذا الموظف.',
    employeeInfo: 'معلومات الموظف:\nالاسم:',
    email: 'البريد الإلكتروني:',
    phone: 'الهاتف:',
    na: 'غير متوفر'
  }
};

export default function EmployeeListView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [departments, setDepartments] = useState([]) // will hold {id,name}
  const [branches, setBranches] = useState([]) // will hold {id,name}
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [editEmployeeData, setEditEmployeeData] = useState(null); // State for edit employee data
  const [lang, setLang] = useState(_getLang());
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await fetchEmployees();
        console.log('Fetched employees data:', data); // Log the fetched data to debug the issue
        setEmployees(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);
  
  // fetch branches & departments for the filter selects
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [b, d] = await Promise.all([
          fetchBranches().catch(err => { console.error('fetchBranches', err); return [] }),
          fetchDepartments().catch(err => { console.error('fetchDepartments', err); return [] })
        ])
        if (!mounted) return
        setBranches(Array.isArray(b) ? b.map(x => ({ id: x.id, name: x.name })) : [])
        setDepartments(Array.isArray(d) ? d.map(x => ({ id: x.id, name: x.name })) : [])
      } catch (err) {
        console.error('Error loading filter lists:', err)
        if (!mounted) return
        setBranches([]); setDepartments([])
      }
    })()
    return () => { mounted = false }
  }, [])

  // derive selected names (for display) if needed
  const selectedDepartmentName = useMemo(() => {
    if (selectedDepartment === 'all') return null
    const d = departments.find(dd => String(dd.id) === String(selectedDepartment))
    return d ? d.name : selectedDepartment
  }, [selectedDepartment, departments])

  const selectedLocationName = useMemo(() => {
    if (selectedLocation === 'all') return null
    const b = branches.find(bb => String(bb.id) === String(selectedLocation))
    return b ? b.name : selectedLocation
  }, [selectedLocation, branches])

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
      // department match: accept when selected 'all' or when employee matches by id or by name/string
      const matchesDepartment = (() => {
        if (selectedDepartment === 'all') return true
        if (!employee) return false
        // compare against common possible fields
        if (String(employee.departmentId) === String(selectedDepartment)) return true
        if (String(employee.department) === String(selectedDepartment)) return true
        if (String(employee.departmentName) === String(selectedDepartment)) return true
        // if we have department name from list, compare by name
        if (selectedDepartmentName && (employee.departmentName === selectedDepartmentName || employee.department === selectedDepartmentName)) return true
        return false
      })()

      const matchesLocation = (() => {
        if (selectedLocation === 'all') return true
        if (!employee) return false
        if (String(employee.branchId) === String(selectedLocation)) return true
        if (String(employee.location) === String(selectedLocation)) return true
        if (String(employee.branchName) === String(selectedLocation)) return true
        if (selectedLocationName && (employee.branchName === selectedLocationName || employee.location === selectedLocationName)) return true
        return false
      })()
      
      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [searchQuery, selectedDepartment, selectedLocation, employees, selectedDepartmentName, selectedLocationName]);

  const handleEdit = async (employee) => {
    try {
      const data = await fetchEmployeeById(employee.code); // Fetch employee data by code
      setEditEmployeeData(data); // Set the fetched data
      setIsEditModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleNotify = (employee) => {
    if (employee.email) {
      window.location.href = `mailto:${employee.email}`;
    } else {
      alert(copy.noEmail);
    }
  };

  const handleDelete = async (employee) => {
    const confirmDelete = window.confirm(`${copy.confirmDelete} ${employee.name}? ${copy.deleteAction}`);
    if (!confirmDelete) return;

    try {
      await deleteEmployee(employee.code); // Use employee.code as the ID
      // Remove the employee from the list
      setEmployees(prev => prev.filter(emp => emp.code !== employee.code));
      alert(copy.deleteSuccess);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert(`${copy.deleteError} ${error.message}`);
    }
  };

  const handleLock = async (employee) => {
    const confirmLock = window.confirm(`${copy.confirmLock} ${employee.locked ? copy.unlock : copy.lock} ${employee.name}?`);
    if (!confirmLock) return;

    try {
      await lockEmployee(employee.code);
      // Update the employee in the list
      setEmployees(prev => prev.map(emp => emp.code === employee.code ? { ...emp, locked: !emp.locked } : emp));
      alert(`${employee.name} ${copy.lockSuccess} ${employee.locked ? copy.unlock : copy.lock}ed successfully!`);
    } catch (error) {
      console.error('Error locking/unlocking employee:', error);
      alert(`${copy.lockError} ${error.message}`);
    }
  };

  const handlePhone = (employee) => {
    if (employee.phoneNumber) {
      window.location.href = `tel:${employee.phoneNumber}`;
    } else {
      alert(copy.noPhone);
    }
  };

  const handleInfo = (employee) => {
    // Open email or show info
    if (employee.email) {
      window.location.href = `mailto:${employee.email}`;
    } else {
      alert(`${copy.employeeInfo} ${employee.name}\n${copy.email} ${employee.email || copy.na}\n${copy.phone} ${employee.phoneNumber || copy.na}\n${copy.department} ${employee.departmentName || copy.na}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedLocation('all');
  };

  const hasActiveFilters = searchQuery || selectedDepartment !== 'all' || selectedLocation !== 'all';

  // navigate to Employee_profile.jsx (route: /employee-portal)
  const handleCardClick = (employee) => {
    navigate('/employee-portal', { state: { employee } }); // Pass the full employee object
  };

  useEffect(() => {
    const unsub = _subscribe((l) => setLang(l));
    return () => unsub();
  }, []);
  const copy = TEXT[lang] || TEXT.en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (loading) {
    return (
      <div className="p-6 lg:p-8" dir={dir} lang={lang}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-4 text-gray-600">{copy.loadingEmployees}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8" dir={dir} lang={lang}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{copy.error} {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {copy.retry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir={dir} lang={lang}>
      <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{copy.filterEmployees}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {copy.searchByName}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={copy.enterEmployeeName}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                {copy.department}
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">{copy.allDepartments}</option>
                {departments.map((dept) => (
                  <option key={dept.id ?? dept.name} value={dept.id ?? dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {copy.officeLocation}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">{copy.allLocations}</option>
                {branches.map((br) => (
                  <option key={br.id ?? br.name} value={br.id ?? br.name}>{br.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters & Clear Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600">{copy.activeFilters}</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                    {copy.search} "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:bg-green-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDepartment !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {selectedDepartmentName ?? selectedDepartment}
                    <button
                      onClick={() => setSelectedDepartment('all')}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedLocation !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    {selectedLocationName ?? selectedLocation}
                    <button
                      onClick={() => setSelectedLocation('all')}
                      className="hover:bg-purple-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
              >
                {copy.clearAll}
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{copy.total}</p>
                <p className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{copy.present}</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {filteredEmployees.filter(e => e.status === "Present").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{copy.onLeave}</p>
                <p className="text-2xl font-bold text-amber-600">
                  {filteredEmployees.filter(e => e.status === "On Leave").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{copy.absent}</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredEmployees.filter(e => e.status === "Absent").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => {
              // Map status to match EmployeeCard config
              const statusMap = {
                "Present": "Stay here",
                "On Leave": "On Leave",
                "Late": "On break",
                "Absent": "Absent"
              };
              const mappedStatus = statusMap[employee.status] || "Stay here";
              
              return (
                <EmployeeCard
                  key={index}
                  employee={{
                    id: employee.code, // Add the employee ID (code) for fetching
                    name: employee.name,
                    role: employee.jobPositionName, // Use jobPositionName for the role
                    department: employee.departmentName,
                    contentType: employee.contentType, // Pass contentType
                    image: employee.data, // Pass base64 image data
                    status: employee.status
                  }}
                  onClick={() => handleCardClick(employee)} // Pass the full employee object
                  onEdit={() => handleEdit(employee)} // Pass the edit handler
                  onNotify={() => handleNotify(employee)}
                  onDelete={() => handleDelete(employee)}
                  onLock={() => handleLock(employee)}
                  onPhone={() => handlePhone(employee)}
                  onInfo={() => handleInfo(employee)}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{copy.noEmployeesFound}</h3>
              <p className="text-sm text-gray-500">{copy.tryAdjusting}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <CreateNewEmployee
          employeeData={editEmployeeData} // Pass the fetched employee data
          onClose={() => {
            setIsEditModalOpen(false);
            setEditEmployeeData(null);
          }} // Close modal handler
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditEmployeeData(null);
            // Optionally refetch employees after update
            // loadEmployees();
          }}
        />
      )}
    </div>
  );
}