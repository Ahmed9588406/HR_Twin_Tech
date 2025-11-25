import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

/**
 * AuthRedirect component - Handles automatic navigation based on authentication status
 * This component checks if user is authenticated on app load and redirects accordingly
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode} - Children after authentication check
 */
const AuthRedirect = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const authenticated = isAuthenticated();
      const currentPath = window.location.pathname;
      
      if (authenticated && currentPath === '/') {
        // User is authenticated and on login page, redirect to dashboard
        const role = getUserRole();
        const isAdmin = role && role.toUpperCase() === 'ADMIN';
        const redirectPath = isAdmin ? '/dashboard' : '/user-dashboard';
        
        navigate(redirectPath, { replace: true });
      }
      
      setIsChecking(false);
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Show nothing while checking (or you could show a loading spinner)
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return children;
};

export default AuthRedirect;
