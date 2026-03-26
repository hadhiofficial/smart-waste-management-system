import { useAuth } from '../hooks/useAuth';

/**
 * AuthGuard Component
 * Protects routes - redirects to login if not authenticated
 *
 * Usage:
 * <AuthGuard>
 *   <Dashboard />
 * </AuthGuard>
 */
export const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="auth-error-page">
        <h1>Access Denied</h1>
        <p>You must be logged in to access this page.</p>
        <a href="/login" className="button-link">
          Go to Login
        </a>
      </div>
    );
  }

  // Show children if authenticated
  return children;
};

export default AuthGuard;
