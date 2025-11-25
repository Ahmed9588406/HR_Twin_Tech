import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

/**
 * PublicRoute component - Wrapper for routes that should only be accessible to non-authenticated users
 * Redirects authenticated users to their appropriate dashboard
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {React.ReactNode} - Children if not authenticated, Navigate to dashboard otherwise
 */
const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  if (authenticated) {
    // User is already authenticated, redirect to appropriate dashboard
    const isAdmin = role && role.toUpperCase() === 'ADMIN';
    const redirectPath = isAdmin ? '/dashboard' : '/user-dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
