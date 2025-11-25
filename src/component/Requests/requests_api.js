// Fetch vacation requests
const fetchVacationRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://api.shl-hr.com/api/v1/requests/vacation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch vacation requests: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch request by ID
export const fetchRequestById = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`https://api.shl-hr.com/api/v1/requests/${requestId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch request: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Approve vacation request
export const approveVacationRequest = async (requestId, paid = true) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  const fullUrl = `https://api.shl-hr.com/api/v1/requests/approve/${encodeURIComponent(requestId)}?paid=${paid ? 'true' : 'false'}`;
  const methods = ['PUT', 'POST', 'PATCH'];

  let lastError = null;
  for (const method of methods) {
    try {
      const opts = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      };

      const res = await fetch(fullUrl, opts);
      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = '';
      }

      let parsed = null;
      try {
        parsed = bodyText ? JSON.parse(bodyText) : null;
      } catch (e) {
        parsed = null;
      }

      if (res.ok) {
        return parsed ?? { success: true, methodUsed: method };
      }

      if (res.status >= 400 && res.status < 500) {
        const message = parsed?.message || bodyText || `HTTP ${res.status} ${res.statusText}`;
        throw new Error(`Failed to approve request (${method}): ${res.status} - ${message}`);
      }

      const message = parsed?.message || bodyText || `HTTP ${res.status} ${res.statusText}`;
      lastError = new Error(`Server error approving request (${method}): ${res.status} - ${message}`);
    } catch (err) {
      lastError = err;
    }
  }

  const details = lastError ? lastError.message : 'Unknown error';
  const error = new Error(`All methods failed to approve request ${requestId}. Last error: ${details}`);
  throw error;
};

// Reject vacation request
export const rejectVacationRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  const fullUrl = `https://api.shl-hr.com/api/v1/requests/reject/${encodeURIComponent(requestId)}`;
  const methods = ['PUT', 'POST', 'PATCH', 'DELETE'];

  let lastError = null;
  for (const method of methods) {
    try {
      const opts = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      };

      const res = await fetch(fullUrl, opts);
      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = '';
      }

      let parsed = null;
      try {
        parsed = bodyText ? JSON.parse(bodyText) : null;
      } catch (e) {
        parsed = null;
      }

      if (res.ok) {
        return parsed ?? { success: true, methodUsed: method };
      }

      if (res.status >= 400 && res.status < 500) {
        const message = parsed?.message || bodyText || `HTTP ${res.status} ${res.statusText}`;
        throw new Error(`Failed to reject request (${method}): ${res.status} - ${message}`);
      }

      const message = parsed?.message || bodyText || `HTTP ${res.status} ${res.statusText}`;
      lastError = new Error(`Server error rejecting request (${method}): ${res.status} - ${message}`);
    } catch (err) {
      lastError = err;
    }
  }

  const details = lastError ? lastError.message : 'Unknown error';
  const error = new Error(`All methods failed to reject request ${requestId}. Last error: ${details}`);
  throw error;
};

// Fetch advance requests
export const fetchAdvanceRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://api.shl-hr.com/api/v1/requests/advance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch advance requests: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch overtime requests
export const fetchOvertimeRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://api.shl-hr.com/api/v1/requests/overtime', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch overtime requests: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch vacation logs (paginated)
export const fetchVacationLogs = async (page = 0, size = 5) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/requests/vacation-log');
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch vacation logs: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const items = Array.isArray(data) ? data : (Array.isArray(data.content) ? data.content : []);
    const totalPages = (typeof data?.totalPages === 'number') ? data.totalPages : 1;
    const totalElements = (typeof data?.totalElements === 'number') ? data.totalElements : items.length;
    const number = (typeof data?.number === 'number') ? data.number : page;
    return { items, totalPages, totalElements, number };
  } catch (error) {
    throw error;
  }
};

// Fetch advance logs (paginated)
export const fetchAdvanceLogs = async (page = 0, size = 5) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/requests/advance-log');
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch advance logs: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const items = Array.isArray(data) ? data : (Array.isArray(data.content) ? data.content : []);
    const totalPages = (typeof data?.totalPages === 'number') ? data.totalPages : 1;
    const totalElements = (typeof data?.totalElements === 'number') ? data.totalElements : items.length;
    const number = (typeof data?.number === 'number') ? data.number : page;
    return { items, totalPages, totalElements, number };
  } catch (error) {
    throw error;
  }
};

// Fetch overtime logs (paginated)
export const fetchOvertimeLogs = async (page = 0, size = 5) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/requests/overtime-log');
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch overtime logs: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const items = Array.isArray(data) ? data : (Array.isArray(data.content) ? data.content : []);
    const totalPages = (typeof data?.totalPages === 'number') ? data.totalPages : 1;
    const totalElements = (typeof data?.totalElements === 'number') ? data.totalElements : items.length;
    const number = (typeof data?.number === 'number') ? data.number : page;
    return { items, totalPages, totalElements, number };
  } catch (error) {
    throw error;
  }
};

// Export fetchVacationRequests as both named and default
export { fetchVacationRequests };
export default fetchVacationRequests;