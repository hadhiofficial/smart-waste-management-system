/**
 * CITIZEN DASHBOARD
 * Citizens can view complaints and report waste issues
 */

import React, { useEffect, useState } from 'react';
import { useCitizen, useImageUpload, useAuth } from '../../hooks/useWasteManagement';
import { imageService } from '../../services/wasteManagementService';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const { complaints, stats, loading, error, success, fetchComplaints, fetchStats, addComplaint } = useCitizen();
  const { uploadImage } = useImageUpload();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complaint_type: 'general',
    bin_id: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (selectedFile) {
        const tempId = Date.now();
        const uploadResult = await uploadImage(selectedFile, tempId);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        }
      }

      // Submit complaint
      const result = await addComplaint({
        ...formData,
        image_url: imageUrl,
      });

      if (result.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          complaint_type: 'general',
          bin_id: null,
        });
        setSelectedFile(null);
        setActiveTab('complaints');
      }
    } finally {
      setSubmitting(false);
    }
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
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Citizen Dashboard</h1>
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
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'complaints'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗂️ My Complaints
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'report'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📝 Report Issue
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_complaints || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.in_progress || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved || 0}</p>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : complaints.length > 0 ? (
              <div className="divide-y">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                        <p className="text-sm text-gray-600">ID: {complaint.id.slice(0, 8)}...</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{complaint.description}</p>
                    {complaint.image_url && (
                      <img
                        src={complaint.image_url}
                        alt="Complaint"
                        className="w-32 h-32 rounded-lg object-cover mb-3"
                      />
                    )}
                    <div className="text-xs text-gray-500">
                      Created: {new Date(complaint.created_at).toLocaleDateString()} 
                      {complaint.resolved_at && ` • Resolved: ${new Date(complaint.resolved_at).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-600">
                <p>No complaints yet. Start reporting issues to help keep your area clean!</p>
              </div>
            )}
          </div>
        )}

        {/* Report Issue Tab */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Report a Waste Issue</h2>

            <form onSubmit={handleSubmitComplaint} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Issue Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Overflowing waste bin"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the issue in detail..."
                  rows="4"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Complaint Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Issue Type</label>
                <select
                  name="complaint_type"
                  value={formData.complaint_type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="overflow">Overflow</option>
                  <option value="damage">Damage</option>
                  <option value="smell">Smell</option>
                  <option value="spill">Spill</option>
                  <option value="missed_collection">Missed Collection</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Photo (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {selectedFile && <p className="text-sm text-green-600 mt-2">✓ {selectedFile.name}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;
