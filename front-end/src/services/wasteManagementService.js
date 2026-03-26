/**
 * WASTE MANAGEMENT SYSTEM - DATABASE SERVICES
 * All database operations centralized here
 * Uses Supabase as backend
 */

import { supabase } from './supabaseClient';

// ============================================
// AUTHENTICATION SERVICES
// ============================================

export const authService = {
  // Sign up with email and password
  async signUp(email, password, name, role = 'citizen') {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user profile
      const { data, error } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          name,
          role,
        },
      ]);

      if (error) throw error;

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('SignUp error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Login with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      return {
        success: true,
        user: data.user,
        role: userData?.role || 'citizen',
      };
    } catch (error) {
      console.error('SignIn error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('SignOut error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get current user with role
  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return userData;
    } catch (error) {
      console.error('Get current user error:', error.message);
      return null;
    }
  },
};

// ============================================
// CITIZEN SERVICES
// ============================================

export const citizenService = {
  // Create a new complaint
  async createComplaint(complaintData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('complaints')
        .insert([
          {
            user_id: user.id,
            ...complaintData,
          },
        ])
        .select();

      if (error) throw error;

      // Send notification
      await notificationService.createNotification(
        user.id,
        'Complaint Submitted',
        'Your waste complaint has been submitted successfully',
        'success',
        null,
        data[0].id
      );

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Create complaint error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get all complaints for current citizen
  async getMyComplaints() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          waste_bins ( bin_code, area_id ),
          assigned_to_user:assigned_to ( name, email )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get complaints error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get citizen dashboard stats
  async getDashboardStats() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      // Get complaint stats
      const { data: complaintStats } = await supabase
        .from('complaints')
        .select('status')
        .eq('user_id', user.id);

      const stats = {
        total_complaints: complaintStats?.length || 0,
        pending: complaintStats?.filter((c) => c.status === 'pending').length || 0,
        resolved: complaintStats?.filter((c) => c.status === 'resolved').length || 0,
        in_progress: complaintStats?.filter((c) => c.status === 'in_progress').length || 0,
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Get dashboard stats error:', error.message);
      return { success: false, error: error.message, data: {} };
    }
  },
};

// ============================================
// DRIVER SERVICES
// ============================================

export const driverService = {
  // Get assigned collection tasks
  async getAssignedTasks(date = null) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('collection_schedule')
        .select(`
          *,
          waste_bins ( bin_code, fill_level, latitude, longitude, area_id ),
          areas ( name, city ),
          driver:driver_id ( name, phone )
        `)
        .eq('driver_id', user.id);

      if (date) {
        query = query.eq('scheduled_date', date);
      }

      const { data, error } = await query.order('scheduled_date', {
        ascending: true,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get assigned tasks error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get today's tasks
  async getTodaysTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAssignedTasks(today);
  },

  // Start collection task
  async startTask(taskId) {
    try {
      const { data, error } = await supabase
        .from('collection_schedule')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Start task error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Complete collection task
  async completeTask(taskId, wasteCollectedKg, notes = '') {
    try {
      const { data, error } = await supabase
        .from('collection_schedule')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          waste_collected_kg: wasteCollectedKg,
          notes: notes,
        })
        .eq('id', taskId)
        .select();

      if (error) throw error;

      // Send success notification
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await notificationService.createNotification(
        user.id,
        'Task Completed',
        `Collection task completed successfully. ${wasteCollectedKg}kg collected.`,
        'success'
      );

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Complete task error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get driver dashboard stats
  async getDashboardStats() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data: tasks } = await supabase
        .from('collection_schedule')
        .select('status, waste_collected_kg')
        .eq('driver_id', user.id);

      const stats = {
        total_tasks: tasks?.length || 0,
        completed: tasks?.filter((t) => t.status === 'completed').length || 0,
        in_progress: tasks?.filter((t) => t.status === 'in_progress').length || 0,
        pending: tasks?.filter((t) => t.status === 'pending').length || 0,
        total_waste_kg: tasks?.reduce((sum, t) => sum + (t.waste_collected_kg || 0), 0) || 0,
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Get dashboard stats error:', error.message);
      return { success: false, error: error.message, data: {} };
    }
  },
};

// ============================================
// ADMIN SERVICES
// ============================================

export const adminService = {
  // Get all complaints
  async getAllComplaints(filters = {}) {
    try {
      let query = supabase.from('complaints').select(`
        *,
        users ( id, name, email ),
        waste_bins ( bin_code, area_id ),
        assigned_to_user:assigned_to ( name, email )
      `);

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.bin_id) query = query.eq('bin_id', filters.bin_id);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get all complaints error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Update complaint status
  async updateComplaintStatus(complaintId, status, notes = '') {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update({
          status,
          resolution_notes: notes,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
        })
        .eq('id', complaintId)
        .select();

      if (error) throw error;

      // Notify citizen
      const { data: complaint } = await supabase
        .from('complaints')
        .select('user_id')
        .eq('id', complaintId)
        .single();

      if (complaint) {
        await notificationService.createNotification(
          complaint.user_id,
          'Complaint Update',
          `Your complaint status has been updated to: ${status}`,
          'info'
        );
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Update complaint error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Assign complaint to driver
  async assignComplaintToDriver(complaintId, driverId) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update({
          assigned_to: driverId,
          status: 'acknowledged',
        })
        .eq('id', complaintId)
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Assign complaint error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get all waste bins
  async getAllWasteBins() {
    try {
      const { data, error } = await supabase
        .from('waste_bins')
        .select(`
          *,
          areas ( name, city ),
          complaints_count:complaints ( count )
        `)
        .order('status', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get all waste bins error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Update waste bin status
  async updateBinStatus(binId, status) {
    try {
      const { data, error } = await supabase
        .from('waste_bins')
        .update({ status })
        .eq('id', binId)
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Update bin status error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get all users by role
  async getUsersByRole(role) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .order('name', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get users by role error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get dashboard KPIs
  async getDashboardKPIs() {
    try {
      const queries = await Promise.all([
        supabase.from('complaints').select('id'),
        supabase.from('complaints').select('id').eq('status', 'pending'),
        supabase.from('complaints').select('id').eq('status', 'resolved'),
        supabase.from('collection_schedule').select('waste_collected_kg').eq('status', 'completed'),
        supabase.from('waste_bins').select('id'),
        supabase.from('waste_bins').select('id').eq('status', 'full'),
        supabase.from('users').select('id').eq('role', 'driver'),
        supabase.from('users').select('id').eq('role', 'citizen'),
      ]);

      const stats = {
        total_complaints: queries[0].data?.length || 0,
        pending_complaints: queries[1].data?.length || 0,
        resolved_complaints: queries[2].data?.length || 0,
        total_waste_collected_kg:
          queries[3].data?.reduce((sum, row) => sum + (row.waste_collected_kg || 0), 0) || 0,
        total_bins: queries[4].data?.length || 0,
        full_bins: queries[5].data?.length || 0,
        total_drivers: queries[6].data?.length || 0,
        total_citizens: queries[7].data?.length || 0,
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Get dashboard KPIs error:', error.message);
      return { success: false, error: error.message, data: {} };
    }
  },

  // Get collection statistics
  async getCollectionStats(startDate = null, endDate = null) {
    try {
      let query = supabase
        .from('collection_schedule')
        .select('scheduled_date, status, waste_collected_kg')
        .eq('status', 'completed');

      if (startDate) query = query.gte('completed_at', startDate);
      if (endDate) query = query.lte('completed_at', endDate);

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get collection stats error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },
};

// ============================================
// AREA SERVICES
// ============================================

export const areaService = {
  // Get all areas
  async getAllAreas() {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get areas error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get waste bins in area
  async getBinsInArea(areaId) {
    try {
      const { data, error } = await supabase
        .from('waste_bins')
        .select('*')
        .eq('area_id', areaId)
        .order('bin_code', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get bins in area error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },
};

// ============================================
// NOTIFICATION SERVICES
// ============================================

export const notificationService = {
  // Create notification
  async createNotification(
    userId,
    title,
    message,
    type = 'info',
    relatedEntityType = null,
    relatedEntityId = null
  ) {
    try {
      const { error } = await supabase.from('notifications').insert([
        {
          user_id: userId,
          title,
          message,
          notification_type: type,
          related_entity_type: relatedEntityType,
          related_entity_id: relatedEntityId,
        },
      ]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Create notification error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get user notifications
  async getNotifications(limit = 20) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Get notifications error:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Mark notification error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Mark all as read
  async markAllAsRead() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('user_id', user.id)
        .eq('read_status', false);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Mark all notifications error:', error.message);
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// IMAGE UPLOAD SERVICE
// ============================================

export const imageService = {
  // Upload image to Supabase Storage
  async uploadComplaintImage(file, complaintId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${complaintId}-${Date.now()}.${fileExt}`;
      const filePath = `complaints/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('waste-management-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('waste-management-images').getPublicUrl(filePath);

      return { success: true, url: data.publicUrl, path: filePath };
    } catch (error) {
      console.error('Upload image error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete image from storage
  async deleteImage(filePath) {
    try {
      const { error } = await supabase.storage
        .from('waste-management-images')
        .remove([filePath]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Delete image error:', error.message);
      return { success: false, error: error.message };
    }
  },
};
