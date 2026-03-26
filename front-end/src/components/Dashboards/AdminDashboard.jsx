/**
 * ADMIN DASHBOARD
 * Admins can view all data, update statuses, assign tasks, and manage the system
 */

import React, { useEffect, useState } from 'react';
import { useAdmin, useAuth } from '../../hooks/useWasteManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const {
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
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('kpis');
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [expandedBinId, setExpandedBinId] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchKPIs();
    fetchComplaints();
    fetchBins();
    fetchUsers();
  }, []);

  const drivers = users.filter(u => u.role === 'driver') || [];

  const handleAssignDriver = async (complaintId) => {
    if (!selectedDriver) {
      alert('Please select a driver');
      return;
    }
    await assignComplaintToDriver(complaintId, selectedDriver);
    setExpandedComplaintId(null);
    setSelectedDriver('');
  };

  const handleUpdateComplaintStatus = async (complaintId, status) => {
    await updateComplaintStatus(complaintId, status, 'Status updated by admin');
    setNewStatus('');
  };

  const handleUpdateBinStatus = async (binId, status) => {
    await updateBinStatus(binId, status);
    setExpandedBinId(null);
  };

  const handleLogout = async () => {
    await logout();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      acknowledged: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      full: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-2 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'kpis'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 KPIs
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-2 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'complaints'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗂️ Complaints
          </button>
          <button
            onClick={() => setActiveTab('bins')}
            className={`py-2 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'bins'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗑️ Waste Bins
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Users
          </button>
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

        {/* KPIs Tab */}
        {activeTab === 'kpis' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">System KPIs</h2>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Complaints</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.total_complaints || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{kpis.resolved_complaints || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{kpis.pending_complaints || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Waste (kg)</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.total_waste_kg || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Bins</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.total_bins || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Full Bins</p>
                  <p className="text-3xl font-bold text-red-600">{kpis.full_bins || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Active Drivers</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.active_drivers || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm">Total Citizens</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.total_citizens || 0}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Complaints</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : complaints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{complaint.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {complaint.complaint_type?.charAt(0).toUpperCase() + complaint.complaint_type?.slice(1)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {complaint.assigned_to_name || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setExpandedComplaintId(
                                expandedComplaintId === complaint.id ? null : complaint.id
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {expandedComplaintId === complaint.id ? '▼ Close' : '▶ Edit'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">No complaints yet.</div>
            )}

            {/* Expanded Complaint Detail */}
            {expandedComplaintId && (
              <div className="border-t p-6 bg-gray-50">
                {(() => {
                  const complaint = complaints.find(c => c.id === expandedComplaintId);
                  return (
                    complaint && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Description</h3>
                          <p className="text-gray-700">{complaint.description}</p>
                        </div>
                        {complaint.image_url && (
                          <div>
                            <h3 className="font-semibold text-gray-900">Image</h3>
                            <img
                              src={complaint.image_url}
                              alt="Complaint"
                              className="w-48 h-48 rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                              Update Status
                            </label>
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select status...</option>
                              <option value="pending">Pending</option>
                              <option value="acknowledged">Acknowledged</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                              Assign Driver
                            </label>
                            <select
                              value={selectedDriver}
                              onChange={(e) => setSelectedDriver(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select driver...</option>
                              {drivers.map((driver) => (
                                <option key={driver.id} value={driver.id}>
                                  {driver.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {newStatus && (
                            <button
                              onClick={() => handleUpdateComplaintStatus(complaint.id, newStatus)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                              Update Status
                            </button>
                          )}
                          {selectedDriver && (
                            <button
                              onClick={() => handleAssignDriver(complaint.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                              Assign Driver
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Bins Tab */}
        {activeTab === 'bins' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Waste Bins Management</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : bins.length > 0 ? (
              <div className="divide-y">
                {bins.map((bin) => (
                  <div key={bin.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          📍 {bin.area_name || 'Unknown Area'}
                        </h3>
                        <p className="text-sm text-gray-600">Bin ID: {bin.id.slice(0, 8)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bin.status)}`}>
                        {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Fill Level</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              bin.fill_level > 80
                                ? 'bg-red-600'
                                : bin.fill_level > 50
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                            }`}
                            style={{ width: `${bin.fill_level || 0}%` }}
                          ></div>
                        </div>
                        <p className="font-semibold text-gray-900 mt-1">{bin.fill_level || 0}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Capacity</p>
                        <p className="font-semibold text-gray-900">{bin.capacity || 100}L</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Emptied</p>
                        <p className="font-semibold text-gray-900">
                          {bin.last_emptied_at ? new Date(bin.last_emptied_at).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Complaints</p>
                        <p className="font-semibold text-gray-900">{bin.complaint_count || 0}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedBinId(expandedBinId === bin.id ? null : bin.id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {expandedBinId === bin.id ? '▼ Close' : '▶ Change Status'}
                    </button>

                    {/* Expanded Bin Status Update */}
                    {expandedBinId === bin.id && (
                      <div className="mt-4 border-t pt-4 bg-gray-50 p-4 rounded-lg">
                        <label className="block text-gray-700 font-semibold mb-2">
                          Update Bin Status
                        </label>
                        <div className="flex gap-2">
                          {['active', 'full', 'maintenance'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleUpdateBinStatus(bin.id, status)}
                              className={`px-4 py-2 rounded-lg font-semibold transition ${
                                bin.status === status
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">No bins found.</div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">System Users</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.status?.charAt(0).toUpperCase() + u.status?.slice(1) || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">No users found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
