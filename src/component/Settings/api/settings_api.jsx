// use the provided absolute URL for all requests
const API_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/branch';
const COMPANY_API_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/company';
const SHIFTS_API_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/shifts';
const DEPARTMENTS_API_URL = 'https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/setting/departments';

export const fetchBranches = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected non-JSON response:', text);
      throw new Error('Invalid JSON response');
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    return data.map(branch => ({
      id: branch.id,
      name: branch.name,
      lat: branch.latitude,
      lng: branch.longitude,
      type: branch.type,
      company: branch.companyName
    }));
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
};

export const fetchBranchById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Fetch response status for branch ID:', id, response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch branch with ID ${id}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected non-JSON response:', text);
      throw new Error('Invalid JSON response');
    }

    const data = await response.json();
    console.log('Fetched branch data:', data);

    return {
      id: data.id,
      name: data.name,
      lat: data.latitude,
      lng: data.longitude,
      type: data.type,
      company: data.companyName
    };
  } catch (error) {
    console.error('Error fetching branch by ID:', error);
    return null;
  }
};

export const createBranch = async (branchData) => {
  console.log('Sending branch data:', branchData);
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  // POST will now go to the proxied relative URL
  const candidateUrls = [
    API_URL,        // /api/v1/setting/branch
    API_URL + '/'   // /api/v1/setting/branch/  (some servers require trailing slash)
  ];

  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  };

  let lastErrMsg = null;

  for (const url of candidateUrls) {
    try {
      console.log('Attempting POST to:', url);
      const res = await fetch(url, { ...opts, body: JSON.stringify(branchData) });
      const text = await res.text();
      console.log(`Response from ${url}:`, res.status, text);

      if (res.ok) {
        try { return JSON.parse(text); } catch { return text; }
      }

      // Save server message for debug and continue trying other candidate URLs
      lastErrMsg = `Status ${res.status} from ${url}: ${text}`;
      // if 404 try next candidate, otherwise break and surface error
      if (res.status === 404) {
        console.warn('Received 404, trying next URL if any');
        continue;
      } else {
        throw new Error(lastErrMsg);
      }
    } catch (err) {
      console.error('Error while POSTing to', url, err);
      lastErrMsg = err.message || String(err);
      // if this attempt failed with something other than 404, stop trying
      if (!lastErrMsg.includes('404')) break;
    }
  }

  throw new Error(`Failed to create branch. Tried: ${candidateUrls.join(', ')}. Last error: ${lastErrMsg}`);
};

// update branch by id: send {id, name, latitude, longitude} as JSON via PUT (only update, never create)
export const updateBranch = async (id, branchData) => {
  console.log('Updating branch id:', id, 'data:', branchData);
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  // For this API, PUT uses base URL with id in body (not in URL)
  const urlBase = API_URL;
  
  // Minimal payload - just the fields being updated
  const minimalPayload = {
    id: Number(id),
    name: branchData.name,
    latitude: branchData.latitude,
    longitude: branchData.longitude
  };

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  console.log('Attempting PUT to', urlBase, 'with payload:', minimalPayload);
  
  try {
    const res = await fetch(urlBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify(minimalPayload)
    });

    const text = await res.text();
    console.log('PUT response:', res.status, text);

    if (!res.ok) {
      throw new Error(`Update failed: ${res.status} - ${text}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response');
    }

    // Return the updated branch data in the format expected by the UI
    return {
      id: data.id,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      type: data.type,
      companyName: data.companyName
    };
  } catch (err) {
    console.error('Error updating branch:', err);
    throw err;
  }
};

export const deleteBranch = async (id) => {
  console.log('Deleting branch id:', id);
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Auth token not found; please log in again.');
  }

  const urlWithId = `${API_URL}/${id}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  try {
    const res = await fetch(urlWithId, {
      method: 'DELETE',
      headers
    });

    const text = await res.text();
    console.log('DELETE response:', res.status, text);

    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status} - ${text}`);
    }

    // Assuming successful delete returns no content or a success message
    return true;
  } catch (err) {
    console.error('Error deleting branch:', err);
    throw err;
  }
};

export const fetchCompanySettings = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const res = await fetch(COMPANY_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log('Fetch company settings status:', res.status);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Failed to fetch company settings: ${res.status} - ${txt}`);
    }

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();
    if (!contentType.includes('application/json')) {
      try {
        // attempt to parse even if header is missing
        return JSON.parse(text);
      } catch {
        console.error('Unexpected non-JSON response for company settings:', text);
        throw new Error('Invalid JSON response for company settings');
      }
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

export const updateCompanySettings = async (settings) => {
  // settings expected shape:
  // { delayTime, delayHour, overTimeMins, discountPercent, overTimePercent }
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Auth token not found; please log in again.');

    const payload = {
      delayTime: Number(settings.delayTime) || 0,
      delayHour: Number(settings.delayHour) || 0,
      overTimeMins: Number(settings.overTimeMins) || 0,
      discountPercent: Number(settings.discountPercent) || 0,
      overTimePercent: Number(settings.overTimePercent) || 0
    };

    console.log('Updating company settings with payload:', payload);

    const res = await fetch(COMPANY_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log('Update company response:', res.status, text);

    if (!res.ok) {
      throw new Error(`Failed to update company settings: ${res.status} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON response for company update:', err);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Error in updateCompanySettings:', error);
    throw error;
  }
};

export const fetchShifts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(SHIFTS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Fetch shifts response status:', response.status);

    if (!response.ok) {
      const txt = await response.text().catch(() => '');
      console.error('Failed to fetch shifts:', response.status, txt);
      throw new Error(`Failed to fetch shifts: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    let data;
    try {
      data = contentType.includes('application/json') ? JSON.parse(text) : JSON.parse(text);
    } catch (err) {
      console.error('Invalid JSON response for shifts:', text);
      throw new Error('Invalid JSON response for shifts');
    }

    if (!Array.isArray(data)) {
      console.warn('Shifts endpoint returned non-array, converting to array if possible', data);
      data = Array.isArray(data.items) ? data.items : [];
    }

    // Normalize each shift object and ensure branchName is present
    const mapped = data.map((shift) => {
      // possible locations / naming for branch name
      const branchName =
        // explicit top-level branchName
        (shift && (shift.branchName || shift.branchname || shift.branch_name)) ||
        // nested branch object with name property
        (shift && shift.branch && (shift.branch.name || shift.branch.branchName || shift.branch.branch_name)) ||
        // nested branch info sometimes under branchInfo or branchData
        (shift && shift.branchInfo && (shift.branchInfo.name || shift.branchInfo.branchName)) ||
        // fallback to branchId string if no name
        (shift && shift.branchId ? `Branch ${shift.branchId}` : 'Unknown');

      return {
        // keep original keys but normalize where helpful
        id: shift.id,
        name: shift.name,
        start: shift.start,
        end: shift.end,
        branchName: branchName,
        branchId: shift.branchId ?? null,
        freeDays: shift.freeDays ?? (shift.free_days ?? '') ,
        companyId: shift.companyId ?? shift.company_id ?? null,
        // include full original object for debugging if needed
        _raw: shift
      };
    });

    console.log('Mapped shifts data:', mapped);
    return mapped;
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return [];
  }
};

export const updateShift = async (shiftData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Auth token not found; please log in again.');

    // Expecting payload shape:
    // { id, branchId, name, start, end, selectedDays, timeZone }
    const res = await fetch(SHIFTS_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(shiftData)
    });

    const text = await res.text();
    console.log('Update shift response:', res.status, text);

    if (!res.ok) {
      throw new Error(`Failed to update shift: ${res.status} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    console.error('Error in updateShift:', err);
    throw err;
  }
};

export const createShift = async (shiftData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Auth token not found; please log in again.');

    // Expecting payload shape: { branchId, name, start, end, selectedDays, timeZone }
    const res = await fetch(SHIFTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(shiftData)
    });

    const text = await res.text();
    console.log('Create shift response:', res.status, text);

    if (!res.ok) {
      throw new Error(`Failed to create shift: ${res.status} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    console.error('Error in createShift:', err);
    throw err;
  }
};

export const fetchShiftById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${SHIFTS_API_URL}/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log('Fetch shift by ID response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch shift with ID ${id}: ${response.status} - ${text}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    let data;
    try {
      data = contentType.includes('application/json') ? JSON.parse(text) : JSON.parse(text);
    } catch (err) {
      console.error('Invalid JSON response for shift by ID:', text);
      throw new Error('Invalid JSON response for shift by ID');
    }

    // Normalize the response data
    return {
      id: data.id,
      name: data.name,
      start: data.start,
      end: data.end,
      branchName: data.branchName,
      branchId: data.branchId,
      freeDays: data.freeDays,
      companyId: data.companyId
    };
  } catch (error) {
    console.error('Error fetching shift by ID:', error);
    return null;
  }
};

export const deleteShift = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `${SHIFTS_API_URL}/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log('Delete shift response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete shift with ID ${id}: ${response.status} - ${text}`);
    }

    // Assuming successful delete returns no content or a success message
    return true;
  } catch (error) {
    console.error('Error deleting shift by ID:', error);
    throw error;
  }
};

// New: fetch departments for dropdowns
export const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const res = await fetch(DEPARTMENTS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log('Fetch departments status:', res.status);

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to fetch departments: ${res.status} - ${txt}`);
    }

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();
    let data;
    try {
      data = contentType.includes('application/json') ? JSON.parse(text) : JSON.parse(text);
    } catch (err) {
      console.error('Invalid JSON response for departments:', text);
      return [];
    }

    // Ensure array form and map to {id, name}
    const arr = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
    return arr.map(d => ({
      id: d.id ?? d.departmentId ?? null,
      name: d.name ?? d.department_name ?? d.title ?? 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};
