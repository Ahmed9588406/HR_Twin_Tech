const BASE_URL = 'https://api.shl-hr.com/api/v1';

const BULK_ACTIONS = {
  CHANGE_POSITION: {
    icon: 'User',
    label: 'Change the Position',
    color: 'from-emerald-500 to-teal-500'
  },
  CHANGE_DEPARTMENT: {
    icon: 'Building2',
    label: 'Change the Department',
    color: 'from-green-500 to-emerald-500'
  },
  ADD_REWARD_DISCOUNT: {
    icon: 'Percent',
    label: 'Add Reward or Discount',
    color: 'from-teal-500 to-cyan-500'
  },
  SEND_VACATION: {
    icon: 'Palmtree',
    label: 'Send Vacation',
    color: 'from-emerald-600 to-green-500'
  }
};

const REWARD_DISCOUNT_FIELDS = [
  "DISCOUNT",
  "REWARD",
  "AMOUNT",
  "NUMOFDAYS",
  "NUMOFHOURS"
];

export const fetchBulkActionUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/bulk-action/users`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch bulk action users';
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
    console.error('Error fetching bulk action users:', error);
    throw error;
  }
};

export const fetchJobPositions = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/job-positions`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch job positions';
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
    console.error('Error fetching job positions:', error);
    throw error;
  }
};

export const changeEmployeePositions = async (empCodes, jobPositionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/change-positions`;
    const payload = {
      empCodes: empCodes, // array of numbers
      jobPositionId: jobPositionId
    };

    console.log('=== Change Positions Request ===');
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Read response body
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to change employee positions';
      try {
        const errorData = responseText ? JSON.parse(responseText) : null;
        if (errorData) {
          console.error('Server error details:', errorData);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = responseText ? JSON.parse(responseText) : null;
    console.log('Change positions success:', data);
    return data;
  } catch (error) {
    console.error('=== Change Positions Error ===');
    console.error('Error details:', error);
    throw error;
  }
};

export const fetchDepartmentsSimple = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/departments/simple`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch departments';
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
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const changeEmployeeDepartments = async (empCodes, departmentId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/change-departments`;
    const payload = {
      empCodes: empCodes.map(String), // ensure array of strings
      departmentId
    };

    console.log('=== Change Departments Request ===');
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'PUT', // changed to PUT
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Read response body
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to change employee departments';
      try {
        const errorData = responseText ? JSON.parse(responseText) : null;
        if (errorData) {
          console.error('Server error details:', errorData);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = responseText ? JSON.parse(responseText) : null;
    console.log('Change departments success:', data);
    return data;
  } catch (error) {
    console.error('=== Change Departments Error ===');
    console.error('Error details:', error);
    throw error;
  }
};

export const postDiscountsRewards = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/discounts-rewards`;

    console.log('=== Post Discounts/Rewards Request ===');
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Read response body
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to post discounts/rewards';
      try {
        const errorData = responseText ? JSON.parse(responseText) : null;
        if (errorData) {
          console.error('Server error details:', errorData);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = responseText ? JSON.parse(responseText) : null;
    console.log('Post discounts/rewards success:', data);
    return data;
  } catch (error) {
    console.error('=== Post Discounts/Rewards Error ===');
    console.error('Error details:', error);
    throw error;
  }
};

export const postVacations = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employees/vacations`;

    console.log('=== Post Vacations Request ===');
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Read response body once
    const responseText = await response.text().catch(() => '');
    console.log('Response body:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to post vacations';
      try {
        const errorData = responseText ? JSON.parse(responseText) : null;
        if (errorData) {
          console.error('Server error details:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          errorMessage = `${response.status}: ${response.statusText}`;
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Parse success body
    const data = responseText ? JSON.parse(responseText) : null;
    console.log('Post vacations success:', data);
    return data;
  } catch (error) {
    console.error('=== Post Vacations Error ===');
    console.error('Error details:', error);
    throw error;
  }
};

