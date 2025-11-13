import React, { useState, useMemo } from "react";
import { Search, Filter, X, MapPin, Building } from "lucide-react";
import EmployeeCard from "../../ui/EmployeeCard";
import { useNavigate } from "react-router-dom";

export default function EmployeeListView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const navigate = useNavigate();

  const employees = [
    {
      name: "Abdulrahman Ahmed",
      department: "Information Technology",
      role: "Backend Developer",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "Present",
      location: "New York Office"
    },
    {
      name: "Sarah Johnson",
      department: "Information Technology",
      role: "Frontend Developer",
      avatar: "https://i.pravatar.cc/150?img=45",
      status: "Present",
      location: "San Francisco Office"
    },
    {
      name: "Michael Chen",
      department: "Marketing",
      role: "Marketing Manager",
      avatar: "https://i.pravatar.cc/150?img=33",
      status: "On Leave",
      location: "New York Office"
    },
    {
      name: "Emily Davis",
      department: "Information Technology",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/150?img=25",
      status: "Late",
      location: "London Office"
    },
    {
      name: "James Wilson",
      department: "Human Resources",
      role: "HR Manager",
      avatar: "https://i.pravatar.cc/150?img=51",
      status: "Absent",
      location: "San Francisco Office"
    },
    {
      name: "Lisa Anderson",
      department: "Finance",
      role: "Accountant",
      avatar: "https://i.pravatar.cc/150?img=14",
      status: "Present",
      location: "London Office"
    },
    {
      name: "Robert Taylor",
      department: "Sales",
      role: "Sales Representative",
      avatar: "https://i.pravatar.cc/150?img=68",
      status: "Present",
      location: "Chicago Office"
    },
    {
      name: "Maria Garcia",
      department: "Operations",
      role: "Operations Manager",
      avatar: "https://i.pravatar.cc/150?img=32",
      status: "On Leave",
      location: "New York Office"
    },
    {
      name: "David Kim",
      department: "Customer Service",
      role: "Customer Support Lead",
      avatar: "https://i.pravatar.cc/150?img=77",
      status: "Present",
      location: "San Francisco Office"
    },
    {
      name: "Jennifer Brown",
      department: "Legal",
      role: "Legal Counsel",
      avatar: "https://i.pravatar.cc/150?img=43",
      status: "Present",
      location: "London Office"
    },
    {
      name: "Thomas Wright",
      department: "Administration",
      role: "Administrative Assistant",
      avatar: "https://i.pravatar.cc/150?img=56",
      status: "Absent",
      location: "Chicago Office"
    },
    {
      name: "Anna Martinez",
      department: "Finance",
      role: "Financial Analyst",
      avatar: "https://i.pravatar.cc/150?img=29",
      status: "Present",
      location: "New York Office"
    }
  ];

  // Get unique departments and locations for filter options
  const departments = useMemo(() => {
    const unique = [...new Set(employees.map(emp => emp.department))];
    return unique.sort();
  }, []);

  const locations = useMemo(() => {
    const unique = [...new Set(employees.map(emp => emp.location))];
    return unique.sort();
  }, []);

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
      const matchesLocation = selectedLocation === 'all' || employee.location === selectedLocation;
      
      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [searchQuery, selectedDepartment, selectedLocation]);

  const handleEdit = (employee) => {
    console.log("Edit:", employee.name);
    // Open edit modal
  };

  const handleNotify = (employee) => {
    console.log("Notify:", employee.name);
    // Send notification
  };

  const handleDelete = (employee) => {
    console.log("Delete:", employee.name);
    // Show confirmation dialog
  };

  const handleLock = (employee) => {
    console.log("Lock/Security:", employee.name);
    // Toggle security settings
  };

  const handlePhone = (employee) => {
    console.log("Call:", employee.name);
    // Initiate call
  };

  const handleInfo = (employee) => {
    console.log("Info:", employee.name);
    // Show employee details
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedLocation('all');
  };

  const hasActiveFilters = searchQuery || selectedDepartment !== 'all' || selectedLocation !== 'all';

  // navigate to Employee_profile.jsx (route: /employee-portal)
  const handleCardClick = (employee) => {
    navigate('/employee-portal', { state: { employee } });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filter Employees</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter employee name..."
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
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Office Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters & Clear Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                    Search: "{searchQuery}"
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
                    {selectedDepartment}
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
                    {selectedLocation}
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
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total</p>
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
                <p className="text-sm text-gray-500 font-medium">Present</p>
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
                <p className="text-sm text-gray-500 font-medium">On Leave</p>
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
                <p className="text-sm text-gray-500 font-medium">Absent</p>
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
                    name: employee.name,
                    role: employee.role,
                    department: employee.department,
                    avatar: employee.avatar,
                    status: mappedStatus,
                    checkInTime: "10:00" // Default check-in time
                  }}
                  onClick={handleCardClick}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}