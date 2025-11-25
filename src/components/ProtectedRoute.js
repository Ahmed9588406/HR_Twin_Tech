import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * ProtectedRoute component - Wrapper for routes that require authentication
 * Redirects to login page if user is not authenticated
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} - Children if authenticated, Navigate to login otherwise
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const authenticated = !!token;
  
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
