import { useState } from 'react';
import { useData } from '../hooks/useData';
import '../styles/CRUD.css';

/**
 * DataTable Component
 * Displays data with search, edit, delete
 *
 * Example:
 * <DataTable tableName="tasks" />
 */
export const DataTable = ({ tableName, columns = ['id', 'title', 'created_at'] }) => {
  const { data, loading, error, refetch, delete: deleteItem, search } = useData(tableName);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState(columns[1] || columns[0]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      refetch();
      return;
    }
    await search(searchColumn, searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditValues(row);
  };

  if (loading && !data.length) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <span>❌ Error:</span> {error}
      </div>
    );
  }

  return (
    <div className="data-table-container">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${searchColumn}...`}
            className="search-input"
          />
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="search-select"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          <button type="submit" className="search-button">
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              refetch();
            }}
            className="button-secondary"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Table */}
      {data.length === 0 ? (
        <div className="empty-state">
          <p>No data found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={`${row.id}-${col}`}>
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editValues[col] || ''}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [col]: e.target.value,
                            })
                          }
                          className="edit-input"
                        />
                      ) : (
                        String(row[col]).substring(0, 50)
                      )}
                    </td>
                  ))}
                  <td className="actions-cell">
                    {editingId === row.id ? (
                      <>
                        <button
                          onClick={() => setEditingId(null)}
                          className="button-small button-success"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="button-small button-secondary"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(row)}
                          className="button-small button-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="button-small button-danger"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && <small className="loading-text">Updating...</small>}
    </div>
  );
};

export default DataTable;
