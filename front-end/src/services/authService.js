import { supabase } from './supabaseClient';

/**
 * Authentication Service
 * Handles all auth-related operations: signup, login, logout, etc.
 */

export const authService = {
  /**
   * Sign up new user with email & password
   * @param {string} email - User email
   * @param {string} password - User password (min 6 chars)
   * @returns {Promise} { user, error }
   */
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('❌ Sign up error:', error.message);
      return {
        user: null,
        session: null,
        error: error.message,
      };
    }
  },

  /**
   * Sign up with Google OAuth
   * @returns {Promise} { url, error }
   */
  async signUpWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { url: data?.url, error: null };
    } catch (error) {
      console.error('❌ Google sign up error:', error.message);
      return { url: null, error: error.message };
    }
  },

  /**
   * Sign up with GitHub OAuth
   * @returns {Promise} { url, error }
   */
  async signUpWithGitHub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { url: data?.url, error: null };
    } catch (error) {
      console.error('❌ GitHub sign up error:', error.message);
      return { url: null, error: error.message };
    }
  },

  /**
   * Log in user with email & password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} { user, session, error }
   */
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return {
        user: null,
        session: null,
        error: error.message,
      };
    }
  },

  /**
   * Log out current user
   * @returns {Promise} { error }
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      return { error: error.message };
    }
  },

  /**
   * Get current user session
   * @returns {Promise} { user, error }
   */
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      return { user, error: null };
    } catch (error) {
      console.error('❌ Get user error:', error.message);
      return { user: null, error: error.message };
    }
  },

  /**
   * Get current session
   * @returns {Promise} { session, error }
   */
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      return { session, error: null };
    } catch (error) {
      console.error('❌ Get session error:', error.message);
      return { session: null, error: error.message };
    }
  },

  /**
   * Listen to auth state changes
   * @param {function} callback - Called when auth state changes
   * @returns {function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback({
        event,
        user: session?.user ?? null,
        session,
      });
    });
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise} { error }
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('❌ Reset password error:', error.message);
      return { error: error.message };
    }
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise} { error }
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('❌ Update password error:', error.message);
      return { error: error.message };
    }
  },
};
