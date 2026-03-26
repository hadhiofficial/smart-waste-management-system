import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import '../styles/CRUD.css';

/**
 * EditData Component
 * Form to edit existing records
 *
 * Example:
 * <EditData tableName="tasks" recordId="123" fields={['title', 'description']} />
 */
export const EditData = ({ tableName, recordId, fields, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load record data on mount
  useEffect(() => {
    const loadRecord = async () => {
      const { data, error: fetchError } = await dataService.getById(
        tableName,
        recordId
      );

      if (fetchError) {
        setError(fetchError);
      } else {
        setFormData(data);
      }

      setLoading(false);
    };

    loadRecord();
  }, [tableName, recordId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    const { error: updateError } = await dataService.update(
      tableName,
      recordId,
      formData
    );

    if (updateError) {
      setError(updateError);
    } else {
      setSuccessMessage('✅ Record updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onSuccess) onSuccess();
      }, 2000);
    }
  };

  if (loading) {
    return <div className="loading">Loading record...</div>;
  }

  return (
    <div className="edit-data-container">
      <h2 className="form-title">Edit Record</h2>

      {error && (
        <div className="error-message">
          <span>❌</span> {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        {fields.map((field) => (
          <div key={field} className="form-group">
            <label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>

            {field.includes('description') ? (
              <textarea
                id={field}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                rows={4}
                className="form-textarea"
              />
            ) : (
              <input
                id={field}
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="form-input"
              />
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="button-primary button-large">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="button-secondary button-large"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditData;
