// change absolute URL to relative path so requests go through the dev proxy
const API_URL = '/api/v1/setting/branch';

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
