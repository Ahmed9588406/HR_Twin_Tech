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
  
  console.log('[ProtectedRoute] Checking authentication...');
  console.log('[ProtectedRoute] Token exists:', authenticated);
  console.log('[ProtectedRoute] Token value:', token);
  
  if (!authenticated) {
    console.log('[ProtectedRoute] ❌ Not authenticated - Redirecting to login');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] ✅ Authenticated - Rendering protected component');
  return children;
};

export default ProtectedRoute;
