import { supabase } from './supabaseClient';

/**
 * Data Service
 * Handles all CRUD operations (Create, Read, Update, Delete)
 */

export const dataService = {
  /**
   * Fetch all records from a table
   * @param {string} tableName - Name of the table
   * @param {object} options - Options like select, orderBy, limit
   * @returns {Promise} { data, error, count }
   *
   * Example:
   * const { data } = await dataService.getAll('tasks', {
   *   orderBy: { column: 'created_at', ascending: false },
   *   limit: 10
   * });
   */
  async getAll(tableName, options = {}) {
    try {
      const { orderBy, limit, select = '*' } = options;

      let query = supabase.from(tableName).select(select, { count: 'exact' });

      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, error: null, count };
    } catch (error) {
      console.error(`❌ Get all from ${tableName} error:`, error.message);
      return { data: [], error: error.message, count: 0 };
    }
  },

  /**
   * Fetch single record by ID
   * @param {string} tableName - Name of the table
   * @param {string|number} id - Record ID
   * @returns {Promise} { data, error }
   */
  async getById(tableName, id) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`❌ Get ${tableName} by ID error:`, error.message);
      return { data: null, error: error.message };
    }
  },

  /**
   * Fetch records with filter
   * @param {string} tableName - Name of the table
   * @param {string} column - Column name to filter
   * @param {any} value - Filter value
   * @returns {Promise} { data, error, count }
   *
   * Example:
   * const { data } = await dataService.getWhere('tasks', 'user_id', '123');
   * const { data } = await dataService.getWhere('tasks', 'status', 'completed');
   */
  async getWhere(tableName, column, value) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .eq(column, value);

      if (error) throw error;

      return { data, error: null, count };
    } catch (error) {
      console.error(`❌ Get where error:`, error.message);
      return { data: [], error: error.message, count: 0 };
    }
  },

  /**
   * Search records
   * @param {string} tableName - Name of the table
   * @param {string} searchColumn - Column to search in
   * @param {string} searchTerm - Search term
   * @returns {Promise} { data, error }
   *
   * Example:
   * const { data } = await dataService.search('tasks', 'title', 'buy');
   */
  async search(tableName, searchColumn, searchTerm) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select()
        .ilike(searchColumn, `%${searchTerm}%`);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`❌ Search error:`, error.message);
      return { data: [], error: error.message };
    }
  },

  /**
   * Insert new record (CREATE)
   * @param {string} tableName - Name of the table
   * @param {object} record - Data to insert
   * @returns {Promise} { data, error }
   *
   * Example:
   * const { data } = await dataService.create('tasks', {
   *   title: 'New Task',
   *   description: 'Task description',
   *   user_id: userId
   * });
   */
  async create(tableName, record) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([record])
        .select();

      if (error) throw error;

      return { data: data[0], error: null };
    } catch (error) {
      console.error(`❌ Create error:`, error.message);
      return { data: null, error: error.message };
    }
  },

  /**
   * Insert multiple records
   * @param {string} tableName - Name of the table
   * @param {array} records - Array of records to insert
   * @returns {Promise} { data, error }
   */
  async createMany(tableName, records) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(records)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`❌ Create many error:`, error.message);
      return { data: [], error: error.message };
    }
  },

  /**
   * Update record by ID (UPDATE)
   * @param {string} tableName - Name of the table
   * @param {string|number} id - Record ID
   * @param {object} updates - Fields to update
   * @returns {Promise} { data, error }
   *
   * Example:
   * const { data } = await dataService.update('tasks', '123', {
   *   title: 'Updated Title',
   *   status: 'completed'
   * });
   */
  async update(tableName, id, updates) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      return { data: data[0], error: null };
    } catch (error) {
      console.error(`❌ Update error:`, error.message);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update multiple records
   * @param {string} tableName - Name of the table
   * @param {string} column - Column to match
   * @param {any} value - Value to match
   * @param {object} updates - Fields to update
   * @returns {Promise} { data, error }
   */
  async updateWhere(tableName, column, value, updates) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq(column, value)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error(`❌ Update where error:`, error.message);
      return { data: [], error: error.message };
    }
  },

  /**
   * Delete record by ID (DELETE)
   * @param {string} tableName - Name of the table
   * @param {string|number} id - Record ID
   * @returns {Promise} { error }
   *
   * Example:
   * const { error } = await dataService.delete('tasks', '123');
   */
  async delete(tableName, id) {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error(`❌ Delete error:`, error.message);
      return { error: error.message };
    }
  },

  /**
   * Delete multiple records
   * @param {string} tableName - Name of the table
   * @param {string} column - Column to match
   * @param {any} value - Value to match
   * @returns {Promise} { error }
   */
  async deleteWhere(tableName, column, value) {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(column, value);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error(`❌ Delete where error:`, error.message);
      return { error: error.message };
    }
  },

  /**
   * Subscribe to real-time changes
   * @param {string} tableName - Name of the table
   * @param {string} event - Event type: 'INSERT', 'UPDATE', 'DELETE', '*'
   * @param {function} callback - Called when data changes
   * @returns {function} Unsubscribe function
   *
   * Example:
   * const unsubscribe = dataService.subscribe('tasks', '*', (payload) => {
   *   console.log('Change received!', payload.eventType, payload.new);
   * });
   */
  subscribe(tableName, event, callback) {
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event, schema: 'public', table: tableName }, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },
};
