import { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import '../styles/CRUD.css';

/**
 * AddData Component
 * Form to create new records
 *
 * Example:
 * <AddData tableName="tasks" fields={['title', 'description', 'priority']} />
 */
export const AddData = ({ tableName, fields, onSuccess }) => {
  const { create, loading, error } = useData(tableName);
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage('');

    // Validate required fields
    const emptyFields = fields.filter((field) => !formData[field]);
    if (emptyFields.length > 0) {
      setLocalError(`Please fill in: ${emptyFields.join(', ')}`);
      return;
    }

    // Create record with user_id if table has it
    const recordData = {
      ...formData,
      user_id: user?.id, // Attach current user
    };

    const result = await create(recordData);

    if (!result) {
      setLocalError(error);
    } else {
      setFormData({});
      setSuccessMessage('✅ Record created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onSuccess) onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="add-data-container">
      <h2 className="form-title">Add New Record</h2>

      {error && (
        <div className="error-message">
          <span>❌</span> {error}
        </div>
      )}

      {localError && (
        <div className="error-message">
          <span>⚠️</span> {localError}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-form">
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
                disabled={loading}
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
                disabled={loading}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="button-primary button-large"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Record'}
        </button>
      </form>
    </div>
  );
};

export default AddData;
