import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

/**
 * useData Hook
 * Simplifies data fetching, loading, and error states
 *
 * Usage:
 * const { data, loading, error, refetch } = useData('tasks', { limit: 10 });
 *
 * const { data, create, update, delete: deleteItem } = useData('tasks');
 */
export const useData = (tableName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch data
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await dataService.getAll(tableName, options);

    if (result.error) {
      setError(result.error);
      console.error(`Error fetching ${tableName}:`, result.error);
    } else {
      setData(result.data || []);
    }

    setLoading(false);
  }, [tableName, options]);

  /**
   * Fetch on mount and when dependencies change
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Manually refetch data
   */
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  /**
   * Create new record
   */
  const create = async (record) => {
    setLoading(true);
    setError(null);

    const result = await dataService.create(tableName, record);

    if (result.error) {
      setError(result.error);
      console.error(`Error creating in ${tableName}:`, result.error);
      setLoading(false);
      return null;
    }

    setData([...data, result.data]);
    setLoading(false);
    return result.data;
  };

  /**
   * Update record
   */
  const update = async (id, updates) => {
    setLoading(true);
    setError(null);

    const result = await dataService.update(tableName, id, updates);

    if (result.error) {
      setError(result.error);
      console.error(`Error updating in ${tableName}:`, result.error);
      setLoading(false);
      return null;
    }

    setData(
      data.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setLoading(false);
    return result.data;
  };

  /**
   * Delete record
   */
  const deleteRecord = async (id) => {
    setLoading(true);
    setError(null);

    const result = await dataService.delete(tableName, id);

    if (result.error) {
      setError(result.error);
      console.error(`Error deleting from ${tableName}:`, result.error);
      setLoading(false);
      return false;
    }

    setData(data.filter((item) => item.id !== id));
    setLoading(false);
    return true;
  };

  /**
   * Search records
   */
  const search = async (column, term) => {
    setLoading(true);
    setError(null);

    const result = await dataService.search(tableName, column, term);

    if (result.error) {
      setError(result.error);
      console.error(`Error searching in ${tableName}:`, result.error);
    } else {
      setData(result.data || []);
    }

    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    refetch,
    create,
    update,
    delete: deleteRecord,
    search,
  };
};
