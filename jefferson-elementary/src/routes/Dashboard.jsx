import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';
import { fetchAllClasses, addClassToDB, deleteClassFromDB } from '../util/classes';
import education from '../assets/education.png';
import { MdMoreVert } from 'react-icons/md';
import { fetchAllTeachers } from '../util/classes';

const Dashboard = () => {
  // ─────────────────────────────────────────────
  // State Variables
  // ─────────────────────────────────────────────
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    teacher: '',
    subject: '',
    description: ''
  })
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [validTeachers, setValidTeachers] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // ─────────────────────────────────────────────
  // Fetch initial class & teacher data
  // ─────────────────────────────────────────────
  useEffect(() => {
    const getInitialData = async () => {
      const classData = await fetchAllClasses();
      const teacherNames = await fetchAllTeachers();
      setClasses(classData);
      setValidTeachers(teacherNames);
    };

    getInitialData();
  }, []);

  // ─────────────────────────────────────────────
  // Handle form submission
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newClass = {
      teacher: formData.teacher,
      subject: formData.subject,
      description: formData.description,
      gradeAvg: 0, // default
      students: {}
    };

    try {
      await addClassToDB(newClass);
      const data = await fetchAllClasses();
      setClasses(data);
      setShowForm(false);
      setFormData({ teacher: '', subject: '', description: '' });
    } catch (err) {
      console.error("Error adding class:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    } // disables button while loading
  };

  return (
    <>
    {/* ─────────────────────────────────────────────
          Class Cards
      ───────────────────────────────────────────── */}
      <div className="container">
        {classes.map((cls) => (
          <div className="box-wrapper" key={cls.id}>
            <div className="menu-container">
              <button
                className="menu-button"
                onClick={() => setOpenMenuId(openMenuId === cls.id ? null : cls.id)}
                aria-label="Options menu"
              >
                <MdMoreVert size={30} />
              </button>
              {openMenuId === cls.id && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={async () => {
                      await deleteClassFromDB(cls.id);
                      const updated = await fetchAllClasses();
                      setClasses(updated);
                      setOpenMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <Link to={`/classes/${cls.id}`}>
              <div className="box">
                <div className="box-content">
                  <img src={education} alt="education" className="box-image" />
                </div>
                <div className="box-footer-text">
                  <p className="teacher-name">{cls.teacher}</p>
                  <p className="subject-name">{cls.subject}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}


      </div>

      {/* ─────────────────────────────────────────────
          Add Class Button
      ───────────────────────────────────────────── */}
      <button
        className="add-class-button"
        onClick={() => setShowForm(true)}
        aria-label="Add new class"
        title="Add new class"
      >
        +
      </button>

      {/* ─────────────────────────────────────────────
          Create New Class Form
      ───────────────────────────────────────────── */}
      {showForm && (
        <div className="modal-overlay">
          <form className="class-form" onSubmit={handleSubmit}>
            <h2>Create New Class</h2>
            <select
              value={formData.teacher}
              onChange={(e) => {
                const selected = e.target.value;
                const teacherObj = validTeachers.find(t => t.name === selected);
                setFormData({ ...formData, teacher: selected, subject: "" });
                setAvailableSubjects(teacherObj?.subjects || []);
              }}
              required
            >
              <option value="" disabled>Select a teacher</option>
              {validTeachers.map((teacher) => (
                <option key={teacher.name} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              disabled={!formData.teacher}
              required
            >
              <option value="" disabled>Select a subject</option>
              {availableSubjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
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