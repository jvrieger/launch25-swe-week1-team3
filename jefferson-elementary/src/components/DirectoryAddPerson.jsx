import React, { useState, useEffect } from 'react';
import "../styles/Directory.css";
import { db } from "../../firebase";
import { getDocs, collection, doc, updateDoc, arrayUnion } from "firebase/firestore";

const DirectoryAddPerson = ({ isOpen, onClose, onSubmit, personType, initialData }) => {
  // function to return the initial empty state (reset form for new person)
  const getInitialState = () => ({
    addClass: '',
    classes: [],
    ...(personType === 'student'
      ? { first_name: '', last_name: '', gradeLevel: '', birthday: '' }
      : { name: '' }
    )
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (!isOpen) return;
  
    if (initialData) {
      setFormData({
        ...initialData,
        addClass: '',
        classes: initialData.classes || []
      });
    } else {
      setFormData(getInitialState());
    }
  }, [isOpen, initialData, personType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [availableClasses, setAvailableClasses] = useState([]);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "classes"));
        const classList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableClasses(classList);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
  
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

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

  const handleStudentSubmit = async (data) => {
    if (data.id) {
      await updateDoc(doc(db, "people", data.id), data);
      return data.id;
    } else {
      const docRef = await addDoc(collection(db, "people"), data);
      return docRef.id;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const submissionData = initialData
      ? { ...formData }
      : { ...formData, type: personType };
  
    const studentId = await onSubmit(submissionData);
  
    if (personType === "student" && studentId) {
      for (const classId of formData.classes) {
        const classRef = doc(db, "classes", classId);
        await updateDoc(classRef, {
          students: arrayUnion(studentId),
        });
      }
    }
  
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Edit' : 'Add New'} {personType}</h2>
        <form onSubmit={handleStudentSubmit}>
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
              {formData.classes.length > 0 ? (
                formData.classes.map((classId, index) => {
                  const classObj = (availableClasses || []).find(c => c.id === classId);
                  return (
                    <div key={index} className="class-item">
                      <span>{classObj?.description || classId}</span>
                      <button
                        type="button"
                        className="btn btn-delete-small"
                        onClick={() => handleDeleteClass(index)}
                        aria-label={`Delete ${classObj?.name || classId}`}
                      >
                        x
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>No classes added yet</p>
              )}
            </div>
          </div>
          
          {personType === 'student' ? (
            <div className="form-group">
              <label>Select a Class</label>
              <select
                name="addClass"
                value={formData.addClass}
                onChange={handleChange}
              >
                <option value="">Choose a class</option>
                {availableClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.description}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-add"
                onClick={handleAddClass}
                disabled={!formData.addClass || formData.classes.includes(formData.addClass)}
              >
                Add
              </button>
            </div>
          ) : (
            <div className="form-group">
              <label>Add Class (text)</label>
              <input
                type="text"
                name="addClass"
                value={formData.addClass}
                onChange={handleChange}
                placeholder="Enter class ID or name"
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
          )}


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