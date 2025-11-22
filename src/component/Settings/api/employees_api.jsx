const EMPLOYEES_API_URL = 'https://api.shl-hr.com/api/v1/employees';

export const fetchEmployees = async (page = 0, size = 10) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${EMPLOYEES_API_URL}?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log(`Fetch employees (page: ${page}, size: ${size}) response status:`, response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch employees: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Fetched employees data:', data);

    // Normalize the response data to match expected structure
    return data.map((employee) => ({
      id: employee.code, // Use code as the unique identifier
      name: employee.name,
      phone: employee.phoneNumber,
      email: employee.email,
      department: employee.departmentName,
      position: employee.jobPositionName,
      manager: employee.managerName,
      company: employee.companyName,
      status: employee.status,
      image: employee.data, // Base64 image data
      contentType: employee.contentType,
      locked: employee.locked
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${EMPLOYEES_API_URL}/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch employee with ID ${id}: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Fetched employee data:', data);

    return {
      id: data.code,
      name: data.name,
      number: data.phoneNumber,
      dateOfBirth: data.birthDate,
      gender: data.gender,
      email: data.email,
      department: data.departmentId,
      position: data.jobPositionId,
      startDate: data.startDate,
      shift: data.shiftId,
      salary: data.salary,
      username: data.username,
      contentType: data.contentType,
      image: data.data
    };
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    throw error;
  }
};
