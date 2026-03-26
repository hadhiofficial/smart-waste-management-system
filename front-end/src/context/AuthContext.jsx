import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

/**
 * AuthContext
 * Provides global authentication state across the app
 * Prevents prop drilling and allows access from any component
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check if user is already logged in on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        console.error('Auth init error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Subscribe to auth state changes (login/logout in other tabs)
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(({ user: authUser }) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  /**
   * Sign up new user
   */
  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await authService.signUp(email, password);
    setUser(result.user);
    if (result.error) setError(result.error);
    setLoading(false);
    return result;
  };

  /**
   * Sign up with Google
   */
  const signupWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const result = await authService.signUpWithGoogle();
    if (result.error) setError(result.error);
    if (result.url) window.location.href = result.url;
    setLoading(false);
    return result;
  };

  /**
   * Sign up with GitHub
   */
  const signupWithGitHub = async () => {
    setLoading(true);
    setError(null);
    const result = await authService.signUpWithGitHub();
    if (result.error) setError(result.error);
    if (result.url) window.location.href = result.url;
    setLoading(false);
    return result;
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await authService.login(email, password);
    setUser(result.user);
    if (result.error) setError(result.error);
    setLoading(false);
    return result;
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    const result = await authService.logout();
    setUser(null);
    if (result.error) setError(result.error);
    setLoading(false);
    return result;
  };

  /**
   * Reset password
   */
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    const result = await authService.resetPassword(email);
    if (result.error) setError(result.error);
    setLoading(false);
    return result;
  };

  /**
   * Update password
   */
  const updatePassword = async (newPassword) => {
    setLoading(true);
    setError(null);
    const result = await authService.updatePassword(newPassword);
    if (result.error) setError(result.error);
    setLoading(false);
    return result;
  };

  const value = {
    user,
    loading,
    error,
    signup,
    signupWithGoogle,
    signupWithGitHub,
    login,
    logout,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
