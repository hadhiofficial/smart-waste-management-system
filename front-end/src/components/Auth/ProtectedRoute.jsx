/**
 * ROLE-BASED ROUTE GUARD
 * Redirects users based on their role after authentication
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useWasteManagement';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      if (!isAuthenticated) {
        navigate('/login');
        setHasRedirected(true);
      } else if (requiredRole && user?.role !== requiredRole) {
        // Redirect to user's role-based route if they don't have required role
        const roleRoutes = {
          admin: '/admin',
          driver: '/driver',
          citizen: '/citizen',
        };
        navigate(roleRoutes[user?.role] || '/login');
        setHasRedirected(true);
      } else if (isAuthenticated && user?.role) {
        // User is authenticated and has correct role
        setHasRedirected(true);
      }
    }
  }, [loading, isAuthenticated, user, navigate, hasRedirected, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return children;
};

export const PublicRoute = ({ children, allowIfAuthenticated = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      if (isAuthenticated && allowIfAuthenticated) {
        const roleRoutes = {
          admin: '/admin',
          driver: '/driver',
          citizen: '/citizen',
        };
        navigate(roleRoutes[user?.role] || '/citizen');
        setHasRedirected(true);
      }
    }
  }, [loading, isAuthenticated, user, navigate, hasRedirected, allowIfAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
