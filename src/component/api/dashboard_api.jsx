const BASE_URL = 'https://api.shl-hr.com/api/v1';

// Common headers for ngrok
const getHeaders = () => ({
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
});

// Fetch attendance statistics (optionally filtered)
export const fetchAttendanceStatistics = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const { date, department } = params || {};
    let url = `${BASE_URL}/dashboard/attendance`;
    const qs = [];
    if (date) qs.push(`date=${encodeURIComponent(date)}`);
    if (department && department !== 'all') qs.push(`department=${encodeURIComponent(department)}`);
    if (qs.length) url += `?${qs.join('&')}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch attendance statistics';
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

// Fetch dashboard data including total employees, attendance, and departments
export const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch dashboard data';
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
