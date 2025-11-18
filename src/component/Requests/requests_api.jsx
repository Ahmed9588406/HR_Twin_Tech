const fetchVacationRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/requests/vacation', {
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
    console.log('Vacation requests response:', data); // Log the response
    return data;
  } catch (error) {
    console.error('Error fetching vacation requests:', error);
    throw error;
  }
};

export const fetchRequestById = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/requests/${requestId}`, {
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
    console.log('Request by ID response:', data); // Log the response
    return data;
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    throw error;
  }
};

// Approve or reject a vacation request (resilient: tries multiple HTTP methods and returns detailed errors)
export const approveVacationRequest = async (requestId, paid = true) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  // relative URL (dev proxy handles forwarding)
  const relativePath = `/api/v1/requests/approve/${encodeURIComponent(requestId)}?paid=${paid ? 'true' : 'false'}`;

  // methods to try in order
  const methods = ['POST', 'PUT', 'PATCH', 'GET'];

  let lastError = null;
  for (const method of methods) {
    try {
      const opts = {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      };

      // Content-Type not needed when no body; keep it off to avoid backend confusion
      const res = await fetch(relativePath, opts);

      // Try to parse body (prefer JSON, fallback to text)
      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = '';
      }

      // attempt to parse JSON if possible
      let parsed = null;
      try {
        parsed = bodyText ? JSON.parse(bodyText) : null;
      } catch (e) {
        parsed = null;
      }

      if (res.ok) {
        // return parsed JSON if available, else a success object
        return parsed ?? { success: true, methodUsed: method };
      }

      // If 4xx -> likely client error; surface immediately with details
      if (res.status >= 400 && res.status < 500) {
        const message = parsed?.message || bodyText || `HTTP ${res.status} ${res.statusText}`;
        throw new Error(`Failed to approve request (${method}): ${res.status} - ${message}`);
      }

      // For 5xx, keep trying other methods but remember the error
      const message = parsed?.message || bodyText || `HTTP ${res.status} ${res.statusText}`;
      lastError = new Error(`Server error approving request (${method}): ${res.status} - ${message}`);
      // continue to next method
    } catch (err) {
      // network or parsing error - store and continue trying other methods
      lastError = err;
    }
  }

  // All methods failed — throw the last captured error with extra context
  const details = lastError ? lastError.message : 'Unknown error';
  const error = new Error(`All methods failed to approve request ${requestId}. Last error: ${details}`);
  console.error(error);
  throw error;
};

// Reject a vacation request (resilient: tries multiple HTTP methods and returns detailed errors)
export const rejectVacationRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  const relativePath = `/api/v1/requests/reject/${encodeURIComponent(requestId)}`;

  // methods to try in order (include DELETE for reject)
  const methods = ['POST', 'PUT', 'PATCH', 'DELETE', 'GET'];

  let lastError = null;
  for (const method of methods) {
    try {
      const opts = {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      };

      const res = await fetch(relativePath, opts);

      let bodyText = '';
      try { bodyText = await res.text(); } catch (e) { bodyText = ''; }

      let parsed = null;
      try { parsed = bodyText ? JSON.parse(bodyText) : null; } catch (e) { parsed = null; }

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
  console.error(error);
  throw error;
}

// Fetch advance requests
export const fetchAdvanceRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/requests/advance', {
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
    console.log('Advance requests response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching advance requests:', error);
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

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/requests/overtime', {
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
    console.log('Overtime requests response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching overtime requests:', error);
    throw error;
  }
};

export { fetchVacationRequests };
export default fetchVacationRequests;