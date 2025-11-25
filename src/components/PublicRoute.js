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

  console.log('[PublicRoute] Checking authentication...');
  console.log('[PublicRoute] Authenticated:', authenticated);
  console.log('[PublicRoute] Role:', role);

  if (authenticated) {
    // User is already authenticated, redirect to appropriate dashboard
    const isAdmin = role && role.toUpperCase() === 'ADMIN';
    const redirectPath = isAdmin ? '/dashboard' : '/user-dashboard';
    
    console.log('[PublicRoute] ✅ User is authenticated - Redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('[PublicRoute] ❌ User not authenticated - Showing login page');
  return children;
};

export default PublicRoute;
