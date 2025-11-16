const DEPARTMENTS_API_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/departments';

export const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(DEPARTMENTS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log('Fetch departments response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch departments: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Fetched departments data:', data);

    // Normalize the response data
    return data.map((department) => ({
      id: department.id,
      name: department.name,
      manager: department.managerName || 'N/A',
      branch: department.branchName,
      branchId: department.branchId,
      date: department.date
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

export const fetchDepartmentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/department/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log(`Fetch department by ID (${id}) response status:`, response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to fetch department with ID ${id}: ${response.status} - ${text}`
      );
    }

    const data = await response.json();
    console.log('Fetched department data:', data);

    // Normalize the response data
    return {
      id: data.id,
      name: data.name,
      manager: data.managerName || 'N/A',
      branch: data.branchName,
      branchId: data.branchId,
      date: data.date
    };
  } catch (error) {
    console.error(`Error fetching department by ID (${id}):`, error);

    // Provide a more user-friendly error message
    if (error.message.includes('500')) {
      throw new Error(
        `Server error occurred while fetching department with ID ${id}. Please try again later.`
      );
    }

    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${DEPARTMENTS_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log(`Delete department response status:`, response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete department with ID ${id}: ${response.status} - ${text}`);
    }

    // Assuming successful delete returns no content
    return true;
  } catch (error) {
    console.error(`Error deleting department with ID ${id}:`, error);
    throw error;
  }
};

export const createDepartment = async (departmentData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(DEPARTMENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(departmentData)
    });

    console.log('Create department response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create department: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Created department data:', data);

    return data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (departmentData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(DEPARTMENTS_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(departmentData)
    });

    console.log('Update department response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update department: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Updated department data:', data);

    return data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};
