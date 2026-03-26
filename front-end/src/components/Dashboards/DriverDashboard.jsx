/**
 * DRIVER DASHBOARD
 * Drivers can view assigned collection tasks and mark them complete
 */

import React, { useEffect, useState } from 'react';
import { useDriver, useAuth } from '../../hooks/useWasteManagement';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, todaysTasks, stats, loading, error, success, fetchTodaysTasks, fetchStats, startTask, completeTask } = useDriver();
  const [activeTab, setActiveTab] = useState('today');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [completeFormData, setCompleteFormData] = useState({
    waste_kg: '',
    notes: '',
  });

  useEffect(() => {
    fetchTodaysTasks();
    fetchStats();
  }, []);

  const handleStartTask = async (taskId) => {
    await startTask(taskId);
  };

  const handleCompleteClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    setCompleteFormData({ waste_kg: '', notes: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompleteFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompleteTask = async (taskId) => {
    if (!completeFormData.waste_kg) {
      alert('Please enter waste collected in kg');
      return;
    }

    await completeTask(taskId, parseFloat(completeFormData.waste_kg), completeFormData.notes);
    setExpandedTaskId(null);
    setCompleteFormData({ waste_kg: '', notes: '' });
  };

  const handleLogout = async () => {
    await logout();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStats = (taskList) => {
    return {
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'pending').length,
      in_progress: taskList.filter(t => t.status === 'in_progress').length,
      completed: taskList.filter(t => t.status === 'completed').length,
    };
  };

  const todaysStats = getTaskStats(todaysTasks);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Today's Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{todaysStats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{todaysStats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-purple-600">{todaysStats.in_progress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{todaysStats.completed}</p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Tasks Completed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.completed_tasks || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Waste Collected (kg)</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_waste_kg || 0}</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Tasks Tab */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Today's Collection Tasks</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : todaysTasks.length > 0 ? (
            <div className="divide-y">
              {todaysTasks.map((task) => (
                <div key={task.id} className="p-6">
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        📍 Area: {task.area_name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-600">Bin ID: {task.bin_id?.slice(0, 8) || 'N/A'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Bin Fill Level</p>
                      <p className="font-semibold text-gray-900">{task.bin_fill_level || 0}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bin Capacity</p>
                      <p className="font-semibold text-gray-900">{task.bin_capacity || 100}L</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Scheduled Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(task.scheduled_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assigned Time</p>
                      <p className="font-semibold text-gray-900">
                        {task.scheduled_date ? new Date(task.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not set'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        ▶️ Start
                      </button>
                    )}

                    {(task.status === 'pending' || task.status === 'in_progress') && (
                      <button
                        onClick={() => handleCompleteClick(task.id)}
                        className={`px-4 py-2 rounded-lg transition ${
                          expandedTaskId === task.id
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {expandedTaskId === task.id ? '✕ Cancel' : '✓ Complete'}
                      </button>
                    )}

                    {task.status === 'completed' && (
                      <div className="text-green-600 font-semibold">
                        ✓ Completed on {new Date(task.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Complete Task Form */}
                  {expandedTaskId === task.id && task.status !== 'completed' && (
                    <div className="mt-6 border-t pt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-4">Complete Task</h4>
                      <div className="space-y-4">
                        {/* Waste Collected */}
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Waste Collected (kg)
                          </label>
                          <input
                            type="number"
                            name="waste_kg"
                            value={completeFormData.waste_kg}
                            onChange={handleFormChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Notes (Optional)
                          </label>
                          <textarea
                            name="notes"
                            value={completeFormData.notes}
                            onChange={handleFormChange}
                            placeholder="Any observations or issues..."
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          ✓ Mark as Completed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p>No tasks assigned for today. Check back later!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
