import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, X, MapPin, Building, ChevronLeft, ChevronRight } from "lucide-react";
import EmployeeCard from "./EmployeeCard";
import CreateNewEmployee from "../../Employee_page/Create_new_Employee"; // Import the modal
import { fetchEmployeeById } from "../../Settings/api/employees_api"; // Import the API function
import { useNavigate } from "react-router-dom";
import { fetchEmployees, deleteEmployee, lockEmployee } from '../../Employee_page/api/emplyee_api'; // Added lockEmployee import
import { fetchDepartments } from '../../Settings/api/department_api' // fetch departments which contain branch info
import { getLang as _getLang, subscribe as _subscribe, t as _t } from '../../../i18n/i18n';

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
  const [departments, setDepartments] = useState([]) // will hold {id,name}
  
  // Store ALL employees (no server pagination)
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [editEmployeeData, setEditEmployeeData] = useState(null); // State for edit employee data
  const [lang, setLang] = useState(_getLang());
  const navigate = useNavigate();

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // items per page

  // Fetch ALL employees on mount (no pagination params)
  useEffect(() => {
    const loadAllEmployees = async () => {
      try {
        setLoading(true);
        // Fetch without page/size to get all employees (or fetch multiple pages until all are loaded)
        const result = await fetchEmployees(0, 9999); // large size to get all
        console.log('Fetched all employees:', result);
        console.log('First employee sample:', result.items?.[0]);
        setAllEmployees(result.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllEmployees();
  }, []);

  // fetch departments for the filter
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const d = await fetchDepartments().catch(err => { 
          console.error('fetchDepartments error:', err); 
          return [] 
        })
        if (!mounted) return
        
        const deptList = Array.isArray(d) ? d.map(x => ({ id: x.id, name: x.name })) : [];
        console.log('Loaded departments for filter:', deptList);
        setDepartments(deptList);
      } catch (err) {
        console.error('Error loading filter lists:', err)
        if (!mounted) return
        setDepartments([])
      }
    })()
    return () => { mounted = false }
  }, [])

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedDepartment]);

  // derive selected names (for display) if needed
  const selectedDepartmentName = useMemo(() => {
    if (selectedDepartment === 'all') return null
    const d = departments.find(dd => String(dd.id) === String(selectedDepartment))
    return d ? d.name : selectedDepartment
  }, [selectedDepartment, departments])

  // CLIENT-SIDE FILTER: apply search & department & location filters
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(employee => {
      // Search filter - match by name or code
      const matchesSearch = (() => {
        if (!searchQuery || searchQuery.trim() === '') return true;
        const query = searchQuery.toLowerCase().trim();
        const empName = String(employee?.name || '').toLowerCase();
        const empCode = String(employee?.code || '').toLowerCase();
        return empName.includes(query) || empCode.includes(query);
      })();

      // Department filter - match by ID or name
      const matchesDepartment = (() => {
        if (selectedDepartment === 'all') return true;
        if (!employee) return false;
        
        // Get employee's department ID and name
        const empDeptId = String(employee?.departmentId || employee?.deptId || '').trim();
        const empDeptName = String(employee?.departmentName || employee?.department || '').trim().toLowerCase();
        
        // Get selected department ID and name
        const selectedDeptId = String(selectedDepartment).trim();
        const selectedDeptNameLower = String(selectedDepartmentName || '').trim().toLowerCase();
        
        // Match by ID first (most reliable)
        if (empDeptId && selectedDeptId && empDeptId === selectedDeptId) return true;
        
        // Match by name
        if (empDeptName && selectedDeptNameLower && empDeptName === selectedDeptNameLower) return true;
        
        // Fallback: match selected value directly against name
        if (empDeptName && empDeptName === selectedDeptId.toLowerCase()) return true;
        
        return false;
      })();

      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment, allEmployees, selectedDepartmentName]);

  // STATISTICS: compute from filteredEmployees with all status variations
  const stats = useMemo(() => {
    const total = filteredEmployees.length;
    
    // Count Present (including variations)
    const present = filteredEmployees.filter(e => {
      const status = String(e?.status || '').toLowerCase().trim();
      return status === 'present' || status === 'here' || status === 'checked in';
    }).length;
    
    // Count On Leave (including variations)
    const onLeave = filteredEmployees.filter(e => {
      const status = String(e?.status || '').toLowerCase().trim();
      return status === 'on leave' || status === 'onleave' || status === 'leave';
    }).length;
    
    // Count Absent (including variations)
    const absent = filteredEmployees.filter(e => {
      const status = String(e?.status || '').toLowerCase().trim();
      return status === 'absent' || status === 'missing';
    }).length;
    
    // Count Left (including variations)
    const left = filteredEmployees.filter(e => {
      const status = String(e?.status || '').toLowerCase().trim();
      return status === 'left' || status === 'gone' || status === 'departed';
    }).length;
    
    // Count Working From Home (including variations)
    const workingFromHome = filteredEmployees.filter(e => {
      const status = String(e?.status || '').toLowerCase().trim();
      return status === 'working from home' || status === 'workingfromhome' || status === 'wfh' || status === 'remote';
    }).length;
    
    return { total, present, onLeave, absent, left, workingFromHome };
  }, [filteredEmployees]);

  // CLIENT-SIDE PAGINATION: slice filteredEmployees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const paginatedEmployees = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredEmployees.slice(start, end);
  }, [filteredEmployees, currentPage, pageSize]);

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
      setAllEmployees(prev => prev.filter(emp => emp.code !== employee.code));
      alert(copy.deleteSuccess);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert(`${TEXT.en.deleteError} ${error.message}`);
    }
  };

  const normalizeLocked = (v) => {
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return ['1','true','yes','locked'].includes(v.toLowerCase());
    return v === true || v === 1;
  };

  const handleLock = async (employee) => {
    const currentlyLocked = normalizeLocked(
      employee.locked ?? employee.isLocked ?? employee.lockedEmployee ?? employee.is_locked ?? employee.accountLocked ?? employee.lockStatus ?? (
        typeof employee.nonLocked !== 'undefined' ? !normalizeLocked(employee.nonLocked) :
        typeof employee.accountNonLocked !== 'undefined' ? !normalizeLocked(employee.accountNonLocked) :
        typeof employee.isNonLocked !== 'undefined' ? !normalizeLocked(employee.isNonLocked) :
        typeof employee.account_non_locked !== 'undefined' ? !normalizeLocked(employee.account_non_locked) :
        undefined
      )
    );
    const confirmLock = window.confirm(`${TEXT.en.confirmLock} ${currentlyLocked ? TEXT.en.unlock : TEXT.en.lock} ${employee.name}?`);
    if (!confirmLock) return;
    try {
      const result = await lockEmployee(employee.code);
      let raw;
      if (result && typeof result === 'object') {
        if (result.locked !== undefined) raw = result.locked;
        else if (result.isLocked !== undefined) raw = result.isLocked;
        else if (result.lockedEmployee !== undefined) raw = result.lockedEmployee;
        else if (result.is_locked !== undefined) raw = result.is_locked;
        else if (result.accountLocked !== undefined) raw = result.accountLocked;
        else if (result.lockStatus !== undefined) raw = result.lockStatus;
        else if (result.nonLocked !== undefined) raw = !normalizeLocked(result.nonLocked);
        else if (result.accountNonLocked !== undefined) raw = !normalizeLocked(result.accountNonLocked);
        else if (result.isNonLocked !== undefined) raw = !normalizeLocked(result.isNonLocked);
        else if (result.account_non_locked !== undefined) raw = !normalizeLocked(result.account_non_locked);
        else raw = result;
      } else {
        raw = result;
      }
      let nextLocked = normalizeLocked(raw);
      // If toggle response is ambiguous, derive from fresh detail
      try {
        const detail = await fetchEmployeeById(employee.code);
        const detailRaw = (
          detail.locked ?? detail.isLocked ?? detail.lockedEmployee ?? detail.is_locked ?? detail.accountLocked ?? detail.lockStatus ?? (
            typeof detail.nonLocked !== 'undefined' ? !normalizeLocked(detail.nonLocked) :
            typeof detail.accountNonLocked !== 'undefined' ? !normalizeLocked(detail.accountNonLocked) :
            typeof detail.isNonLocked !== 'undefined' ? !normalizeLocked(detail.isNonLocked) :
            typeof detail.account_non_locked !== 'undefined' ? !normalizeLocked(detail.account_non_locked) :
            undefined
          )
        );
        const derived = normalizeLocked(detailRaw);
        if (typeof derived === 'boolean') nextLocked = derived;
      } catch (_) {
        // fall back to optimistic toggle if detail fetch fails and result was ambiguous
        if (raw === undefined || raw === null || (typeof raw === 'string' && !['1','true','yes','locked','0','false','no','unlocked','open'].includes(String(raw).toLowerCase()))) {
          nextLocked = !currentlyLocked;
        }
      }
      setAllEmployees(prev =>
        prev.map(emp =>
          emp.code === employee.code ? { ...emp, locked: nextLocked } : emp
        )
      );
      alert(`${employee.name} ${TEXT.en.lockSuccess} ${nextLocked ? TEXT.en.lock : TEXT.en.unlock}ed successfully!`);
    } catch (error) {
      console.error('Error locking/unlocking employee:', error);
      alert(`${TEXT.en.lockError} ${error.message}`);
    }
  };

  const handlePhone = (employee) => {
    if (employee.phoneNumber) {
      window.location.href = `tel:${employee.phoneNumber}`;
    } else {
      alert(TEXT.en.noPhone);
    }
  };

  const handleInfo = (employee) => {
    // Open email or show info
    if (employee.email) {
      window.location.href = `mailto:${employee.email}`;
    } else {
      alert(`${TEXT.en.employeeInfo} ${employee.name}\n${TEXT.en.email} ${employee.email || TEXT.en.na}\n${TEXT.en.phone} ${employee.phoneNumber || TEXT.en.na}\n${TEXT.en.department} ${employee.departmentName || TEXT.en.na}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
  };

  const hasActiveFilters = searchQuery || selectedDepartment !== 'all';

  // navigate to Employee_profile.jsx (route: /employee-portal)
  const handleCardClick = (employee) => {
    navigate('/employee-portal', { state: { employee } }); // Pass the full employee object
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Stats - now computed from filteredEmployees with all 5 statuses */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {/* Total */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium mb-1">{copy.total}</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              <div className="mt-2 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Present */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium mb-1">{copy.present}</p>
              <p className="text-xl font-bold text-emerald-600">{stats.present}</p>
              <div className="mt-2 w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Left */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium mb-1">{_t('LEFT')}</p>
              <p className="text-xl font-bold text-blue-600">{stats.left}</p>
              <div className="mt-2 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium mb-1">{copy.onLeave}</p>
              <p className="text-xl font-bold text-amber-600">{stats.onLeave}</p>
              <div className="mt-2 w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Working From Home */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium mb-1">{_t('WORKING_FROM_HOME')}</p>
              <p className="text-xl font-bold text-purple-600">{stats.workingFromHome}</p>
              <div className="mt-2 w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium mb-1">{copy.absent}</p>
              <p className="text-xl font-bold text-red-600">{stats.absent}</p>
              <div className="mt-2 w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Cards Grid - render paginatedEmployees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee, index) => {
              // Keep the original status from API (no mapping needed now)
              const employeeStatus = employee.status || "Present";
              
              return (
                <EmployeeCard
                  key={index}
                  employee={{
                    id: employee.code,
                    name: employee.name,
                    role: employee.jobPositionName,
                    department: employee.departmentName,
                    contentType: employee.contentType,
                    image: employee.data,
                    status: employee.status,
                    locked: normalizeLocked(
                      employee.locked ?? employee.isLocked ?? employee.lockedEmployee ?? employee.is_locked ?? employee.accountLocked ?? employee.lockStatus ?? (
                        typeof employee.nonLocked !== 'undefined' ? !normalizeLocked(employee.nonLocked) :
                        typeof employee.accountNonLocked !== 'undefined' ? !normalizeLocked(employee.accountNonLocked) :
                        typeof employee.isNonLocked !== 'undefined' ? !normalizeLocked(employee.isNonLocked) :
                        typeof employee.account_non_locked !== 'undefined' ? !normalizeLocked(employee.account_non_locked) :
                        undefined
                      )
                    )
                  }}
                  onClick={() => handleCardClick(employee)}
                  onEdit={() => handleEdit(employee)}
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

        {/* Pagination Controls - show if more than 1 page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">
              {_t('PAGINATION_FOOTER', { page: String(currentPage + 1), totalPages: String(totalPages), total: String(filteredEmployees.length) })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                {_t('PREVIOUS')}
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage >= totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500'
                }`}
              >
                {_t('NEXT')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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