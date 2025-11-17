const BASE_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1';

// Common headers for ngrok
const getHeaders = () => ({
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
});

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
    formData.append('jobPositionId', parseInt(employeeData.position)); // Parse as integer
    formData.append('salary', employeeData.salary);
    formData.append('departmentId', parseInt(employeeData.department)); // Parse as integer
    formData.append('shiftId', parseInt(employeeData.shift)); // Parse as integer
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
        // Don't set Content-Type for FormData, browser will set it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create employee';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
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
    return data;
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
    formData.append('jobPositionId', parseInt(employeeData.position)); // Parse as integer
    formData.append('salary', employeeData.salary);
    formData.append('departmentId', parseInt(employeeData.department)); // Parse as integer
    formData.append('shiftId', parseInt(employeeData.shift)); // Parse as integer
    formData.append('username', employeeData.username);
    // Only append password if it's provided and not empty
    if (employeeData.password && employeeData.password.trim() !== '') {
      formData.append('password', employeeData.password);
    }
    
    // Append file if exists
    if (employeeData.file) {
      formData.append('file', employeeData.file);
    }

    // Log the FormData for debugging
    console.log('FormData being sent to the server for update:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(`${BASE_URL}/employees/${employeeData.id}`, {
      method: 'PUT', // Reverted from PATCH to PUT to resolve CORS
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, browser will set it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update employee';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};
