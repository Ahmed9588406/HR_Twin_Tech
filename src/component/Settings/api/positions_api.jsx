const POSITIONS_API_URL = 'https://api.shl-hr.com/api/v1/setting/job-positions';

export const fetchPositions = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(POSITIONS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch positions: ${response.status} - ${text}`);
    }

    const data = await response.json();
    // Normalize the response data to match the component's expectations
    return data.map((position) => ({
      id: position.id,
      name: position.name,
      department: position.departmentName,
      employees: position.numberOfEmps
    }));
  } catch (error) {
    return [];
  }
};

export const fetchPositionById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = `https://api.shl-hr.com/api/v1/setting/job-position/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    console.log(`response status:`, response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch position with ID ${id}: ${response.status} - ${text}`);
    }

    const data = await response.json();
    // Normalize the response data to match the component's expectations
    return {
      id: data.id,
      name: data.name,
      department: data.departmentName,
      employees: data.numberOfEmps
    };
  } catch (error) {
    console.error(`Error fetching position:`, error);
    return null;
  }
};

export const createPosition = async (positionData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(POSITIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(positionData)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create position: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePosition = async (positionData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(POSITIONS_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(positionData)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update position: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const deletePosition = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${POSITIONS_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete position with ID ${id}: ${response.status} - ${text}`);
    }

    // Assuming successful delete returns no content
    return true;
  } catch (error) {
    throw error;
  }
};
