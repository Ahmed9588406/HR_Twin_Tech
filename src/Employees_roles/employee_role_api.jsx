export const fetchEmpAttendanceHistory = async (options = {}) => {
  // options optional: { page, size } — currently not used by backend but kept for future
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    // build URL (page/size optional)
    const params = [];
    if (options.page !== undefined) params.push(`page=${encodeURIComponent(options.page)}`);
    if (options.size !== undefined) params.push(`size=${encodeURIComponent(options.size)}`);
    const query = params.length ? `?${params.join('&')}` : '';

    const res = await fetch(`https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/emp-dashboard/attendance-history${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      // try to include server body for diagnostics
      const body = text || res.statusText;
      throw new Error(`Failed to fetch attendance history: ${res.status} - ${body}`);
    }

    // parse JSON (handle empty body)
    const data = text ? JSON.parse(text) : [];
    // Expecting an array of records (see sample in prompt)
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format for attendance history');
    }

    return data;
  } catch (err) {
    console.error('Error in fetchEmpAttendanceHistory:', err);
    throw err;
  }
};

export const fetchEmployeeDetails = async (empCode) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const res = await fetch(`https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/emp-dashboard/employee-details?empCode=${encodeURIComponent(empCode)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const body = text || res.statusText;
      throw new Error(`Failed to fetch employee details: ${res.status} - ${body}`);
    }

    const data = text ? JSON.parse(text) : {};
    return data;
  } catch (err) {
    console.error('Error in fetchEmployeeDetails:', err);
    throw err;
  }
};

export default fetchEmpAttendanceHistory;
