import axios from 'axios';

export const loginUser = async (credentials) => {
  try {
    const resp = await axios.post('https://api.shl-hr.com/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!resp || !resp.data) {
      throw new Error('Empty response from authentication server');
    }

    return resp.data;
  } catch (err) {
    const serverMessage = err.response?.data?.message || err.response?.data || err.message;
    throw new Error(`Login failed: ${serverMessage}`);
  }
};

export default loginUser;
