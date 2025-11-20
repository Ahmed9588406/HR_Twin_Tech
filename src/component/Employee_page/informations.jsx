import React from 'react';

// Function to fetch employee details from the API
export const fetchEmployeeDetails = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/dashboard/${empCode}/details`;
    console.log('[DEBUG] Fetching employee details from URL:', url);
    console.log('[DEBUG] Using token:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('[DEBUG] Response status:', response.status);
    console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Failed to fetch employee details';
      try {
        const errorData = await response.json();
        console.log('[DEBUG] Error response data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.log('[DEBUG] Failed to parse error response:', e);
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('[DEBUG] Raw API response data:', data);
    console.log('[DEBUG] shiftName:', data.shiftName);
    console.log('[DEBUG] shiftTime:', data.shiftTime);
    console.log('[DEBUG] branchName:', data.branchName);
    console.log('[DEBUG] departmentName:', data.departmentName);
    console.log('[DEBUG] jobPosition:', data.jobPosition);

    // Transform the API response to match the expected format for the modal
    const transformedData = {
      department: data.departmentName || 'N/A',
      shift: data.shiftName && data.shiftTime ? `${data.shiftName} (${data.shiftTime})` : 'N/A',
      jobPosition: data.jobPosition || 'N/A',
      branch: data.branchName || 'N/A'
    };

    console.log('[DEBUG] Transformed data:', transformedData);
    console.log('[DEBUG] department:', transformedData.department);
    console.log('[DEBUG] shift:', transformedData.shift);
    console.log('[DEBUG] jobPosition:', transformedData.jobPosition);
    console.log('[DEBUG] branch:', transformedData.branch);

    return transformedData;
  } catch (error) {
    console.error('[DEBUG] Error in fetchEmployeeDetails:', error);
    throw error;
  }
};

const EmployeeDetailsModal = ({ isOpen, onClose, profileData, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideUp">
        {/* Header with Green Gradient */}
        <div className="h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 group"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-8 -mt-8 relative">
          {/* Title Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Employee Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">Professional Information</p>
          </div>
          
          {/* Details Grid */}
          <div className="space-y-4">
            {/* Department */}
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Department</p>
                  <p className="font-bold text-gray-800 text-lg">{profileData?.department || employee?.department || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {/* Shift */}
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">Shift</p>
                  <p className="font-bold text-gray-800 text-lg">{profileData?.shift || employee?.shift || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {/* Position */}
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Position</p>
                  <p className="font-bold text-gray-800 text-lg">{profileData?.jobPosition || employee?.jobPositionName || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Branch */}
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl border-2 border-lime-100 hover:border-lime-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-lime-600 uppercase tracking-wide mb-1">Branch</p>
                  <p className="font-bold text-gray-800 text-lg">{profileData?.branch || employee?.branch || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;

// This file is no longer used as the details are now displayed directly in the profile card.
