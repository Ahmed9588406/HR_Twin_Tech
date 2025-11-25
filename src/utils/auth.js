/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
};

/**
 * Get user role from localStorage
 * @returns {string} - User role (ADMIN, USER, etc.)
 */
export const getUserRole = () => {
  return localStorage.getItem('role') || '';
};

/**
 * Get user data from localStorage
 * @returns {object|null} - User data object or null
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('code');
  localStorage.removeItem('userData');
};
