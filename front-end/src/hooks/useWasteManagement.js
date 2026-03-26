/**
 * CUSTOM HOOKS FOR STATE MANAGEMENT
 * Handles loading, error, and data states
 */

import { useState, useEffect, useCallback } from 'react';
import {
  authService,
  citizenService,
  driverService,
  adminService,
  areaService,
  notificationService,
  imageService,
} from '../services/wasteManagementService';

// ============================================
// USEAUTH HOOK - Authentication state
// ============================================

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    setLoading(true);
    const userData = await authService.getCurrentUser();
    setUser(userData);
    setLoading(false);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await authService.signIn(email, password);
    if (result.success) {
      setUser(result.user);
      setError(null);
      return { success: true, role: result.role };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const signup = useCallback(async (email, password, name, role) => {
    setLoading(true);
    setError(null);
    const result = await authService.signUp(email, password, name, role);
    if (result.success) {
      setUser(result.user);
      setError(null);
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await authService.signOut();
    if (result.success) {
      setUser(null);
      setError(null);
    } else {
      setError(result.error);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    retry: getCurrentUser,
  };
};

// ============================================
// USECITIZEN HOOK - Citizen operations
// ============================================

export const useCitizen = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await citizenService.getMyComplaints();
    if (result.success) {
      setComplaints(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const result = await citizenService.getDashboardStats();
    if (result.success) {
      setStats(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const addComplaint = useCallback(async (complaintData) => {
    setLoading(true);
    setError(null);
    const result = await citizenService.createComplaint(complaintData);
    if (result.success) {
      setSuccess('Complaint submitted successfully');
      setComplaints([result.data, ...complaints]);
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  useEffect(() => {
    // Clear success message after 3 seconds
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return {
    complaints,
    stats,
    loading,
    error,
    success,
    fetchComplaints,
    fetchStats,
    addComplaint,
  };
};

// ============================================
// USEDRIVER HOOK - Driver operations
// ============================================

export const useDriver = () => {
  const [tasks, setTasks] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchTasks = useCallback(async (date = null) => {
    setLoading(true);
    setError(null);
    const result = await driverService.getAssignedTasks(date);
    if (result.success) {
      setTasks(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const fetchTodaysTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await driverService.getTodaysTasks();
    if (result.success) {
      setTodaysTasks(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const result = await driverService.getDashboardStats();
    if (result.success) {
      setStats(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const startTask = useCallback(async (taskId) => {
    setLoading(true);
    setError(null);
    const result = await driverService.startTask(taskId);
    if (result.success) {
      setSuccess('Task started');
      fetchTodaysTasks();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const completeTask = useCallback(async (taskId, wasteKg, notes) => {
    setLoading(true);
    setError(null);
    const result = await driverService.completeTask(taskId, wasteKg, notes);
    if (result.success) {
      setSuccess('Task completed successfully');
      fetchTodaysTasks();
      fetchStats();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return {
    tasks,
    todaysTasks,
    stats,
    loading,
    error,
    success,
    fetchTasks,
    fetchTodaysTasks,
    fetchStats,
    startTask,
    completeTask,
  };
};

// ============================================
// USEADMIN HOOK - Admin operations
// ============================================

export const useAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [bins, setBins] = useState([]);
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState({});
  const [collectionStats, setCollectionStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    const result = await adminService.getAllComplaints(filters);
    if (result.success) {
      setComplaints(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const fetchBins = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminService.getAllWasteBins();
    if (result.success) {
      setBins(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async (role = null) => {
    setLoading(true);
    setError(null);
    if (role) {
      const result = await adminService.getUsersByRole(role);
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  }, []);

  const fetchKPIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminService.getDashboardKPIs();
    if (result.success) {
      setKpis(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const updateComplaintStatus = useCallback(async (complaintId, status, notes = '') => {
    setLoading(true);
    setError(null);
    const result = await adminService.updateComplaintStatus(complaintId, status, notes);
    if (result.success) {
      setSuccess('Complaint updated');
      fetchComplaints();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const updateBinStatus = useCallback(async (binId, status) => {
    setLoading(true);
    setError(null);
    const result = await adminService.updateBinStatus(binId, status);
    if (result.success) {
      setSuccess('Bin status updated');
      fetchBins();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const assignComplaintToDriver = useCallback(async (complaintId, driverId) => {
    setLoading(true);
    setError(null);
    const result = await adminService.assignComplaintToDriver(complaintId, driverId);
    if (result.success) {
      setSuccess('Complaint assigned');
      fetchComplaints();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return {
    complaints,
    bins,
    users,
    kpis,
    collectionStats,
    loading,
    error,
    success,
    fetchComplaints,
    fetchBins,
    fetchUsers,
    fetchKPIs,
    updateComplaintStatus,
    updateBinStatus,
    assignComplaintToDriver,
  };
};

// ============================================
// USENOTIFICATIONS HOOK
// ============================================

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await notificationService.getNotifications();
    if (result.success) {
      setNotifications(result.data);
      const unread = result.data.filter((n) => !n.read_status).length;
      setUnreadCount(unread);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    setError(null);
    const result = await notificationService.markAsRead(notificationId);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read_status: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else {
      setError(result.error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setError(null);
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
      setUnreadCount(0);
    } else {
      setError(result.error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

// ============================================
// USEIMAGE HOOK - Image upload
// ============================================

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const uploadImage = useCallback(async (file, complaintId) => {
    setLoading(true);
    setError(null);
    const result = await imageService.uploadComplaintImage(file, complaintId);
    if (result.success) {
      setSuccess('Image uploaded');
      return result;
    } else {
      setError(result.error);
      return result;
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return {
    loading,
    error,
    success,
    uploadImage,
  };
};
