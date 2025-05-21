import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';
import { fetchAllClasses, addClassToDB } from '../util/classes';
import education from '../assets/education.png';

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    teacher: '',
    gradeLevel: '',
    description: ''
  })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getClasses = async () => {
      const data = await fetchAllClasses();
      setClasses(data);
    };

    getClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newClass = {
      teacher: formData.teacher,
      gradeLevel: Number(formData.gradeLevel),
      description: formData.description,
      gradeAvg: 0, // default
      students: {}
    };

    try {
      await addClassToDB(newClass);
      const data = await fetchAllClasses();
      setClasses(data);
      setShowForm(false);
      setFormData({ teacher: '', gradeLevel: '', description: '' });
    } catch (err) {
      console.error("Error adding class:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    } // disables button while loading
  };

  return (
    <>
    <div className="container">
      {classes.map((cls) => (
        <Link to={`/`} key={cls.id}>
          <div className="box">
            <div className="box-content">
              <img src={education} alt="education" className="box-image" />
            </div>
            <div className="box-footer">
              <p className="teacher-name">{cls.teacher}'s Class</p>
            </div>
          </div>
        </Link>
      ))}
    </div>

    <button
      className="add-class-button"
      onClick={() => setShowForm(true)}
      aria-label="Add new class"
      title="Add new class"
    >
      +
    </button>
    {showForm && (
      <div className="modal-overlay">
        <form className = "class-form" onSubmit={handleSubmit}>
          <h2>Create New Class</h2>
          <input
            type="text"
            placeholder="Teacher's Name (e.g., Mr. Todd)"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value})}
            required
          />
          <input
            type = "number"
            placeholder = "Grade Level (e.g., 1)"
            value = {formData.gradeLevel}
            onChange = {(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
            required
          />
          <textarea
            placeholder="Class Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <div className="form-buttons">
            <button type="submit" disabled={loading}> 
              {loading ? "Submitting..." : "Submit"}
            </button> 
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      </div>
    )}
    </>
  );
};

export default Dashboard