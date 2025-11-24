export const fetchFinancialData = async (month = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/financial/table');
    if (month) {
      url.searchParams.append('month', month);
    }

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

export const getCount = async (month = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/financial/count');
    if (month) {
      url.searchParams.append('month', month);
    }

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

export const getReward = async (month = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/financial/rewards');
    if (month) {
      url.searchParams.append('month', month);
    }

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

export const getDiscounts = async (month = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const url = new URL('https://api.shl-hr.com/api/v1/financial/discounts');
    if (month) {
      url.searchParams.append('month', month);
    }

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
