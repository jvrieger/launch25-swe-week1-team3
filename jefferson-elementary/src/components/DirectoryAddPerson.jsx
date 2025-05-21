import React, { useState, useEffect } from 'react';
import "../styles/Directory.css";

const DirectoryAddPerson = ({ isOpen, onClose, onSubmit, personType, initialData }) => {
  // function to return the initial empty state (reset form for new person)
  const getInitialState = () => ({
    addClass: '',
    classes: [],
    ...(personType === 'student' ? { 
      first_name: '', 
      last_name: '', 
      gradeLevel: '', 
      birthday: '' 
    } : { 
      name: '' 
    })
  });
  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        addClass: '', // Reset addClass field
        // Ensure classes is always an array
        classes: initialData.classes || []
      });
    } else {
      setFormData(getInitialState());
    }
  }, [initialData, personType, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (formData.addClass.trim()) {
      setFormData(prev => ({
        ...prev,
        classes: [...prev.classes, formData.addClass.trim()],
        addClass: ''
      }));
    }
  };

  const handleDeleteClass = (index) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData ? initialData.id : Date.now(), // temporary ID generation
      type: personType
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Edit' : 'Add New'} {personType}</h2>
        <form onSubmit={handleSubmit}>
          {personType === 'student' ? (
            <>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="" >Select Grade</option>
                  <option value="0" >Kindergarten</option>
                  <option value="1" >1st Grade</option>
                  <option value="2" >2nd Grade</option>
                  <option value="3" >3rd Grade</option>
                  <option value="4" >4th Grade</option>
                  <option value="5" >5th Grade</option>
                </select>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Current Classes</label>
            <div className="classes-list">
              {formData.classes && formData.classes.length > 0 ? (
                formData.classes.map((className, index) => (
                  <div key={index} className="class-item">
                    <span>{className}</span>
                    <button
                      type="button"
                      className="btn btn-delete-small"
                      onClick={() => handleDeleteClass(index)}
                      aria-label={`Delete ${className}`}
                    >
                      x
                    </button>
                  </div>
                ))
              ) : (
                <p>No classes added yet</p>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>Add New Class</label>
            <div className="add-class-container">
              <input
                type="text"
                name="addClass"
                value={formData.addClass}
                onChange={handleChange}
                placeholder="Enter class name"
              />
              <button
                type="button"
                className="btn btn-add"
                onClick={handleAddClass}
                disabled={!formData.addClass.trim()}
              >
                Add
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectoryAddPerson;