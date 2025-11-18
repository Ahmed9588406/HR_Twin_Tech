export const fetchFinancialData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/financial/table', {
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
      throw new Error(`Failed to fetch financial data: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
};

export const getCount = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/financial/count', {
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
      throw new Error(`Failed to fetch financial count: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching financial count:', error);
    throw error;
  }
};

export const getReward = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/financial/rewards', {
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
      throw new Error(`Failed to fetch rewards: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
};

export const getDiscounts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch('https://noneffusive-reminiscent-tanna.ngrok-free.dev/api/v1/financial/discounts', {
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
      throw new Error(`Failed to fetch discounts: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};
