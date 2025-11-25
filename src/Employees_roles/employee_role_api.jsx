import { getLang } from '../i18n/i18n'; // add near top of file (after existing imports)

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

    const url = `https://api.shl-hr.com/api/v1/emp-dashboard/attendance-history?month=${month}&year=${year}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
      },
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const body = text || res.statusText;
      console.error(`Attendance history error: ${res.status} - ${body}`);
      throw new Error(`Failed to fetch attendance history: ${res.status} - ${body}`);
    }

    const data = text ? JSON.parse(text) : [];
    const records = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
    if (!Array.isArray(records)) {
      throw new Error('Unexpected response format for attendance history');
    }

    return records;
  } catch (err) {
    throw err;
  }
};

const BASE_URL = 'https://api.shl-hr.com/api/v1/';

export const fetchEmployeeProfile = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}emp-dashboard/employee-details?empCode=${encodeURIComponent(empCode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
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

    const url = `${BASE_URL}emp-dashboard/financial-details?empCode=${encodeURIComponent(empCode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
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
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeRewards = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}emp-dashboard/rewards-transactions?empCode=${encodeURIComponent(empCode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
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
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeDiscounts = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}emp-dashboard/discounts-transactions?empCode=${encodeURIComponent(empCode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
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
    return data;
  } catch (error) {
    throw error;
  }
};

export const postVacationRequest = async (empCode, payload = {}, file = null) => {
  try {
    const token = localStorage.getItem('token') || '';
    const url = `${BASE_URL}emp-dashboard/vacation-request`;

    const form = new FormData();
    
    // Add all required fields based on the image specification
    form.append('empCode', empCode || '');
    
    // Use 'startDate' instead of 'leaveStartDate'
    if (payload.startDate) {
      form.append('startDate', payload.startDate);
    }
    
    // Use 'endDate' instead of 'leaveEndDate'
    if (payload.endDate) {
      form.append('endDate', payload.endDate);
    }
    
    // Use 'requestDate' 
    if (payload.requestDate) {
      form.append('requestDate', payload.requestDate);
    }
    
    // Use 'leaveType' (should be 'ANNUAL' or 'SICK')
    if (payload.leaveType) {
      form.append('leaveType', payload.leaveType);
    }
    
    // Use 'comment' 
    if (payload.comment) {
      form.append('comment', payload.comment);
    }
    
    // Add attachment if file exists
    if (file) {
      form.append('attachments', file);
    }

    for (let pair of form.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
        // Do NOT set Content-Type for FormData - browser sets it automatically with boundary
      },
      body: form,
    });

    console.log('Vacation request response:', res.status);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let serverMsg = text || `${res.status} ${res.statusText}`;
      try {
        const json = text ? JSON.parse(text) : null;
        if (json) serverMsg = json.message || json.error || JSON.stringify(json);
      } catch {
        /* keep raw text */
      }
      throw new Error(serverMsg);
    }

    // Try parse json response, otherwise return null
    const data = await res.json().catch(() => null);
    return data;
  } catch (err) {
    throw err;
  }
};

export const postAdvanceRequest = async (payload = {}) => {
  try {
    const token = localStorage.getItem('token') || '';
    const url = `${BASE_URL}emp-dashboard/advance-request`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
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
      throw new Error(serverMsg);
    }

    const data = await res.json().catch(() => null);
    return data;
  } catch (err) {
    throw err;
  }
};

export const uploadEmployeePhoto = async (empCode, file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}emp-dashboard/upload-file`;

    const formData = new FormData();
    formData.append('file', file); // key must match backend expectation

    const lang = (typeof getLang === 'function' ? getLang() : (localStorage.getItem('i18nLang') || 'en')) || 'en';

    const response = await fetch(url, {
      method: 'PUT', // Changed from POST to PUT to match Postman screenshot
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': lang,
        // Do NOT set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    console.log('Upload photo response:', response.status);

    if (!response.ok) {
      // try to read body as JSON or text
      let serverMsg = '';
      try {
        const text = await response.text();
        try {
          const json = text ? JSON.parse(text) : null;
          serverMsg = json?.message || json?.error || text || `${response.status} ${response.statusText}`;
        } catch {
          serverMsg = text || `${response.status} ${response.statusText}`;
        }
      } catch (e) {
        serverMsg = `${response.status}: ${response.statusText}`;
      }

      throw new Error(`${serverMsg} (status ${response.status})`);
    }

    const data = await response.json().catch(() => null);
    return data;
  } catch (error) {
    throw error;
  }
};

export const markAttendance = async (latitude, longitude) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}emp-dashboard/mark-attendance`; // Changed from dashboard to emp-dashboard
    
    const requestBody = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    };

    console.log('Marking attendance with:', requestBody);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Mark attendance response:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to mark attendance';
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
        } catch (e) {
        errorMessage = responseText || `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const markLeave = async (latitude, longitude) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${BASE_URL}emp-dashboard/mark-leave`;
    
    const requestBody = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    };

    console.log('Marking leave with:', requestBody);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'X-Time-Zone': 'Africa/Cairo',
        'Accept-Language': 'ar',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Mark leave response:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to mark leave';
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
        } catch (e) {
        errorMessage = responseText || `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchEmpAttendanceHistory;
