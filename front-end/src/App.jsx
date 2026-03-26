/**
 * APP.JSX - Main application with routing
 * Routes based on user authentication and role
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useWasteManagement';
import ProtectedRoute, { PublicRoute } from './components/Auth/ProtectedRoute';
import LoginEnhanced from './components/Auth/LoginEnhanced';
import CitizenDashboard from './components/Dashboards/CitizenDashboard';
import DriverDashboard from './components/Dashboards/DriverDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import './index.css';

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><LoginEnhanced /></PublicRoute>} />

        {/* Citizen Routes */}
        <Route 
          path="/citizen" 
          element={<ProtectedRoute requiredRole="citizen"><CitizenDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/citizen/*" 
          element={<ProtectedRoute requiredRole="citizen"><CitizenDashboard /></ProtectedRoute>} 
        />

        {/* Driver Routes */}
        <Route 
          path="/driver" 
          element={<ProtectedRoute requiredRole="driver"><DriverDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/driver/*" 
          element={<ProtectedRoute requiredRole="driver"><DriverDashboard /></ProtectedRoute>} 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/*" 
          element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />

        {/* Catch all - redirect to login or role-based dashboard */}
        <Route path="/" element={isAuthenticated ? <Navigate to={`/${user?.role}`} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

/**
 * ROUTING STRUCTURE EXPLANATION:
 * 
 * 1. BrowserRouter Setup
 *    - Enables client-side routing
 *    - All routes are handled by React, not server
 * 
 * 2. AuthProvider Wrapper
 *    - Wraps entire app to provide global auth state
 *    - Makes useAuth() hook available throughout app
 *    - Automatically restores user session on mount
 * 
 * 3. Public Routes
 *    - /login, /signup accessible without authentication
 *    - Login component handles email/password and OAuth
 *    - SignUp component handles user registration
 * 
 * 4. Protected Routes
 *    - /dashboard wrapped with AuthGuard
 *    - AuthGuard checks if user is authenticated
 *    - If not authenticated, shows login link
 *    - If authenticated, renders Dashboard component
 * 
 * 5. Default Navigation
 *    - / redirects to /dashboard
 *    - Unknown routes also redirect to /dashboard
 *    - AuthGuard will handle access control
 * 
 * AUTHENTICATION FLOW:
 * 
 * User not authenticated:
 *   → Visit / → Redirect to /dashboard
 *   → AuthGuard shows "Access Denied" + login link
 *   → Click login link → Go to /login
 *   → Login form with email/password or OAuth
 *   → On success, redirects to /dashboard
 *   → AuthGuard now shows Dashboard
 * 
 * User authenticated:
 *   → Visit / → Redirect to /dashboard
 *   → AuthGuard sees user is authenticated
 *   → Shows Dashboard component
 *   → Click logout → Clears session
 *   → Visit /dashboard → Goes to login again
 * 
 * IMPORTANT PATTERNS:
 * 
 * 1. AuthGuard is the security boundary
 *    - Always wrap protected routes with it
 *    - It checks useAuth().isAuthenticated
 * 
 * 2. AuthProvider must wrap Router
 *    - Provides context for all routes
 *    - Must be outermost provider
 * 
 * 3. React Router v6 patterns
 *    - Routes instead of Switch
 *    - Route element prop instead of component
 *    - Navigate instead of Redirect
 * 
 * 4. Environment variables not needed here
 *    - Supabase URL/Key only needed in supabaseClient.js
 *    - Not used for routing decisions
 * 
 * EXTENDING ROUTES:
 * 
 * To add new protected page:
 *   1. Create component (e.g., DataAnalytics.jsx)
 *   2. Add route with AuthGuard:
 *      <Route path="/analytics" element={<AuthGuard><DataAnalytics /></AuthGuard>} />
 *   3. Make sure to add navigation links in Dashboard
 * 
 * To add new public page:
 *   1. Create component (e.g., ForgotPassword.jsx)
 *   2. Add route without AuthGuard:
 *      <Route path="/forgot-password" element={<ForgotPassword />} />
 * 
 * SESSION PERSISTENCE:
 * 
 * AuthContext automatically:
 * - Checks localStorage for existing session on mount
 * - Subscribes to Supabase auth changes
 * - Updates user state when auth state changes
 * - Works across browser tabs if using Supabase
 * 
 * This means:
 * - User stays logged in after refresh
 * - Multiple tabs stay in sync
 * - Logout in one tab logs out all tabs
 */
