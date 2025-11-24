const BASE_URL = 'https://api.shl-hr.com/api/v1';

// Common headers for ngrok
const getHeaders = () => ({
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
});

// Helper to convert base64 to File object
function base64ToFile(base64, contentType, filename) {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return new File([blob], filename, { type: contentType });
}

// Fetch departments
export const fetchDepartments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/employees/departments`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Fetch shifts
export const fetchShifts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/employees/shifts`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch shifts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shifts:', error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const formData = new FormData();
    
    // Append all text fields
    formData.append('name', employeeData.name);
    formData.append('number', employeeData.number);
    formData.append('birthDate', employeeData.dateOfBirth);
    formData.append('gender', employeeData.gender);
    formData.append('email', employeeData.email);
    formData.append('startDate', employeeData.startDate);
    formData.append('jobPositionId', parseInt(employeeData.position));
    formData.append('salary', employeeData.salary);
    formData.append('departmentId', parseInt(employeeData.department));
    formData.append('shiftId', parseInt(employeeData.shift));
    formData.append('username', employeeData.username);
    formData.append('password', employeeData.password);
    
    // Append file if exists
    if (employeeData.file) {
      formData.append('file', employeeData.file);
    }

    // Log the FormData for debugging
    console.log('FormData being sent to the server:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create employee';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Fetch employees
const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return ['true', '1', 'yes', 'locked'].includes(value.toLowerCase());
  return false;
};

export const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    const data = await response.json();
    return Array.isArray(data)
      ? data.map(emp => ({
          ...emp,
          locked: toBoolean(
            emp.locked ?? emp.isLocked ?? emp.lockedEmployee ?? emp.is_locked
          )
        }))
      : [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Update existing employee
export const updateEmployee = async (employeeData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const formData = new FormData();
    
    // Append all text fields
    formData.append('name', employeeData.name);
    formData.append('number', employeeData.number);
    formData.append('birthDate', employeeData.dateOfBirth);
    formData.append('gender', employeeData.gender);
    formData.append('email', employeeData.email);
    formData.append('startDate', employeeData.startDate);
    formData.append('jobPositionId', parseInt(employeeData.position));
    formData.append('salary', employeeData.salary);
    formData.append('departmentId', parseInt(employeeData.department));
    formData.append('shiftId', parseInt(employeeData.shift));
    formData.append('username', employeeData.username);

    // Only append password if it's provided and not empty
    if (employeeData.password && employeeData.password.trim() !== '') {
      formData.append('password', employeeData.password);
    }
    
    // Handle file upload
    if (employeeData.file) {
      // User uploaded a new file
      formData.append('file', employeeData.file);
    } else if (employeeData.image && employeeData.contentType) {
      // No new file uploaded, convert existing base64 image to File
      const extension = employeeData.contentType.split('/')[1] || 'png';
      const filename = `employee-${employeeData.id}.${extension}`;
      const imageFile = base64ToFile(employeeData.image, employeeData.contentType, filename);
      formData.append('file', imageFile);
    } else if (employeeData.data && employeeData.contentType) {
      // Fallback: if 'image' field doesn't exist, try 'data' field
      const extension = employeeData.contentType.split('/')[1] || 'png';
      const filename = `employee-${employeeData.id}.${extension}`;
      const imageFile = base64ToFile(employeeData.data, employeeData.contentType, filename);
      formData.append('file', imageFile);
    }

    // Log the FormData for debugging
    console.log('FormData being sent to the server for update:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${BASE_URL}/employees/${employeeData.id}`, {
      method: 'PUT',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let details = '';
      try {
        const json = await response.json();
        details = json.message || JSON.stringify(json);
      } catch (e) {
        try {
          details = await response.text();
        } catch (e2) {
          details = `${response.status}: ${response.statusText}`;
        }
      }
      let errorMessage = details ? `Failed to update employee: ${details}` : 'Failed to update employee';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Delete existing employee
export const deleteEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/delete/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete employee';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Assuming successful deletion returns no content or a success message
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

// Mark attendance
export const markAttendance = async (empCode, arrivalTime) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard/mark-attendance`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        empCode: parseInt(empCode),
        arrivalTime: arrivalTime,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to mark attendance';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // Expected: true
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

// Mark leave
export const markLeave = async (empCode, leaveTime) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard/mark-leave`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        empCode: parseInt(empCode),
        leaveTime: leaveTime,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to mark leave';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // Expected: true
  } catch (error) {
    console.error('Error marking leave:', error);
    throw error;
  }
};

// Fetch employee profile by code
export const fetchEmployeeProfile = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard/${empCode}/profile`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch employee profile';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    throw error;
  }
};

// Fetch employee salary details by empCode
export const fetchEmployeeSalary = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard/${empCode}/salary-details`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch employee salary details';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employee salary:', error);
    throw error;
  }
};

// Fetch employee attendance history by empCode with pagination
export const fetchEmployeeAttendanceHistory = async (empCode, page = 0, size = 5) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard/${empCode}/attendance-history?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch employee attendance history';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employee attendance history:', error);
    throw error;
  }
};

// Lock/unlock existing employee
export const lockEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/lock/${employeeId}`, {
      method: 'PUT', // Assuming PUT based on typical REST API for toggle actions
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to lock/unlock employee';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error locking/unlocking employee:', error);
    throw error;
  }
};

// Upload employee photo
export const uploadEmployeePhoto = async (empCode, file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/emp-dashboard/upload-file`; // No query params

    const formData = new FormData();
    formData.append('file', file); // Only append the file

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
        // Do not set Content-Type for FormData
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to upload photo';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log('Error data:', errorData);
      } catch (e) {
        // If not JSON, get text
        const text = await response.text();
        errorMessage = text || `${response.status}: ${response.statusText}`;
        console.log('Error text:', text);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Photo uploaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};
