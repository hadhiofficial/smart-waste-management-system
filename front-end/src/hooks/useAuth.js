import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * Easy access to auth state from any component
 *
 * Usage:
 * const { user, loading, signup, login, logout } = useAuth();
 *
 * if (loading) return <div>Loading...</div>;
 * if (!user) return <Navigate to="/login" />;
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
        'Wrap your app with <AuthProvider> in App.jsx'
    );
  }

  return context;
};
