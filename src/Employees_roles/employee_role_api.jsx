export const fetchEmpAttendanceHistory = async (empCode, options = {}) => {
  // options optional: { page, size } — sent as query params
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    // Get current month and year or use provided options
    const now = new Date();
    const month = options.month !== undefined ? options.month : now.getMonth() + 1; // getMonth() returns 0-11
    const year = options.year !== undefined ? options.year : now.getFullYear();

    const url = `https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/emp-dashboard/attendance-history?month=${month}&year=${year}`;

    console.log(`Fetching attendance history for month: ${month}, year: ${year}`);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const body = text || res.statusText;
      console.error(`Failed to fetch attendance history: ${res.status} - ${body}`);
      console.error('Response headers:', Object.fromEntries(res.headers.entries()));
      console.error('Request URL:', url);
      console.error('Token present:', !!token);
      throw new Error(`Failed to fetch attendance history: ${res.status} - ${body}`);
    }

    console.log('Endpoint return:', text);
    const data = text ? JSON.parse(text) : [];
    console.debug('fetchEmpAttendanceHistory - raw response:', data);
    
    const records = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
    console.debug('fetchEmpAttendanceHistory - normalized records:', records);
    
    if (!Array.isArray(records)) {
      throw new Error('Unexpected response format for attendance history');
    }

    console.log('Attendance history fetched successfully:', records);
    return records;
  } catch (err) {
    console.error('Error in fetchEmpAttendanceHistory:', err);
    throw err;
  }
};

const BASE_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/emp-dashboard';

export const fetchEmployeeProfile = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/employee-details?empCode=${encodeURIComponent(empCode)}`;

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

export const fetchAttendanceRecords = async (empCode, options = {}) => {
	// simple wrapper to keep caller code semantically clear
	return fetchEmpAttendanceHistory(empCode, options);
};

export const fetchEmployeeSalary = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/financial-details?empCode=${encodeURIComponent(empCode)}`;

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
      let errorMessage = 'Failed to fetch employee salary';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Employee salary fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching employee salary:', error);
    throw error;
  }
};

export const fetchEmployeeRewards = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/rewards-transactions?empCode=${encodeURIComponent(empCode)}`;

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
      let errorMessage = 'Failed to fetch employee rewards';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Employee rewards fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching employee rewards:', error);
    throw error;
  }
};

export const fetchEmployeeDiscounts = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}/discounts-transactions?empCode=${encodeURIComponent(empCode)}`;

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
      let errorMessage = 'Failed to fetch employee discounts';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Employee discounts fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching employee discounts:', error);
    throw error;
  }
};

export const postVacationRequest = async (empCode, payload = {}, file = null) => {
  try {
    const token = localStorage.getItem('token') || '';
    const url = `${BASE_URL}/vacation-request`;

    let res;
    if (file) {
      const form = new FormData();
      // fields expected by API per image: requestDate, startDate, endDate, leaveType, comment, attachments
      form.append('empCode', empCode || '');
      if (payload.requestDate) form.append('requestDate', payload.requestDate);
      if (payload.startDate) form.append('startDate', payload.startDate);
      if (payload.endDate) form.append('endDate', payload.endDate);
      if (payload.leaveType) form.append('leaveType', payload.leaveType);
      if (payload.comment) form.append('comment', payload.comment);
      // attachments key (single file). Adjust if API expects array.
      form.append('attachments', file);

      res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'ngrok-skip-browser-warning': 'true',
          // do NOT set Content-Type for FormData
        },
        body: form,
      });
    } else {
      // JSON payload (no attachments)
      const body = {
        empCode: empCode || '',
        ...payload
      };
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(body)
      });
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let serverMsg = text || `${res.status} ${res.statusText}`;
      try {
        const json = text ? JSON.parse(text) : null;
        if (json) serverMsg = json.message || json.error || JSON.stringify(json);
      } catch {
        /* keep raw text */
      }
      console.error('postVacationRequest failed:', { status: res.status, body: serverMsg });
      throw new Error(serverMsg);
    }

    // try parse json response, otherwise return null
    const data = await res.json().catch(() => null);
    return data;
  } catch (err) {
    console.error('Error in postVacationRequest:', err);
    throw err;
  }
};

export const postAdvanceRequest = async (payload = {}) => {
  try {
    const token = localStorage.getItem('token') || '';
    const url = `${BASE_URL}/advance-request`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let serverMsg = text || `${res.status} ${res.statusText}`;
      try {
        const json = text ? JSON.parse(text) : null;
        if (json) serverMsg = json.message || json.error || JSON.stringify(json);
      } catch {
        /* keep raw text */
      }
      console.error('postAdvanceRequest failed:', { status: res.status, body: serverMsg });
      throw new Error(serverMsg);
    }

    const data = await res.json().catch(() => null);
    return data;
  } catch (err) {
    console.error('Error in postAdvanceRequest:', err);
    throw err;
  }
};

export default fetchEmpAttendanceHistory;
