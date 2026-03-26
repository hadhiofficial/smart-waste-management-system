import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataTable } from './CRUD/DataTable';
import { AddData } from './CRUD/AddData';
import '../styles/Dashboard.css';

/**
 * Dashboard Component
 * Main protected page showing data operations and user info
 */
export const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleSuccess = () => {
    setActiveTab('view');
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">📊 Dashboard</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="button-logout">
              {authLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Message */}
          <div className="welcome-card">
            <h2>Welcome! 👋</h2>
            <p>You're successfully connected to Supabase. Use the tabs below to manage your data.</p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              📋 View Data
            </button>
            <button
              className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              ➕ Add Data
            </button>
            <button
              className={`tab-button ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              📚 Documentation
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'view' && (
              <section className="tab-pane">
                <h3>All Records</h3>
                <p className="section-help">
                  This example uses a 'tasks' table. Replace with your actual table name.
                </p>
                <DataTable
                  key={refreshKey}
                  tableName="tasks"
                  columns={['id', 'title', 'description', 'user_id']}
                />
              </section>
            )}

            {activeTab === 'add' && (
              <section className="tab-pane">
                <h3>Create New Record</h3>
                <p className="section-help">
                  Fill in the form below to add a new record to the database.
                </p>
                <AddData
                  tableName="tasks"
                  fields={['title', 'description']}
                  onSuccess={handleSuccess}
                />
              </section>
            )}

            {activeTab === 'docs' && (
              <section className="tab-pane">
                <h3>Quick Reference 📚</h3>

                <div className="doc-section">
                  <h4>✅ What you can do:</h4>
                  <ul>
                    <li><strong>View Records:</strong> All data from your table</li>
                    <li><strong>Create:</strong> Add new records with the form</li>
                    <li><strong>Update:</strong> Edit records inline in the table</li>
                    <li><strong>Delete:</strong> Remove records (with confirmation)</li>
                    <li><strong>Search:</strong> Find records by any column</li>
                  </ul>
                </div>

                <div className="doc-section">
                  <h4>🔧 Using the Hooks:</h4>
                  <pre className="code-block">
{`// Get data with hooks
const { data, loading, error, create, update, delete } = useData('tasks');

// Access auth
const { user, logout, signup, login } = useAuth();

// Create record
const newTask = await create({ title: 'Task', description: 'Desc' });

// Update record
await update(taskId, { title: 'Updated' });

// Delete record
await delete(taskId);`}
                  </pre>
                </div>

                <div className="doc-section">
                  <h4>⚙️ Environment Variables:</h4>
                  <pre className="code-block">
{`VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here`}
                  </pre>
                </div>

                <div className="doc-section">
                  <h4>🚀 Next Steps:</h4>
                  <ol>
                    <li>Create tables in Supabase dashboard</li>
                    <li>Set up Row Level Security (RLS) policies</li>
                    <li>Replace 'tasks' with your table names</li>
                    <li>Customize fields to match your schema</li>
                    <li>Deploy to production 🎉</li>
                  </ol>
                </div>

                <div className="doc-section info-box">
                  <p>
                    <strong>💡 Tip:</strong> Check the browser console (F12) to see 
                    request/response logs for debugging.
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
