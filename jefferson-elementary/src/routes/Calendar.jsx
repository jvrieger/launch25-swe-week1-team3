import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarStyles.css';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const SchoolCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
  });

  const [events, setEvents] = useState([]);

  // 🔄 Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // 📤 Handle new or edited event submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      name: formData.title,
      description: formData.description,
      time: formData.time,
      date: selectedDate.toDateString(),
    };

    try {
      if (isEditing) {
        const eventRef = doc(db, 'events', editEventId);
        await updateDoc(eventRef, eventData);
        setEvents((prev) =>
          prev.map((event) =>
            event.id === editEventId ? { ...event, ...eventData } : event
          )
        );
        // alert('Event updated!');
      } else {
        const docRef = await addDoc(collection(db, 'events'), eventData);
        setEvents((prev) => [...prev, { ...eventData, id: docRef.id }]);
        // alert('Event added!');
      }

      setFormData({ title: '', description: '', time: '' });
      setIsEditing(false);
      setEditEventId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  // 🗑 Handle delete
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
      // alert('Event deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // 📝 Update input fields
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 📅 Filter events by selected date
  const eventsForSelectedDate = events.filter(
    (event) => event.date === selectedDate.toDateString()
  );

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">School Calendar 2025–2026</h1>
      <p>Select a date to view or add events.</p>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="school-calendar"
      />

      {/* ➕ Add Button */}
      <button
        className="floating-add-button"
        onClick={() => {
          setFormData({ title: '', description: '', time: '' });
          setIsEditing(false);
          setShowForm(true);
        }}
        title="Add Event"
      >
        +
      </button>

      {/* 🧾 Event Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? 'Edit' : 'Add'} Event for {selectedDate.toDateString()}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="modal-buttons">
                <button className="cancel-button" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="submit-button" type="submit">
                  {isEditing ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Event List */}
      <div className="event-list">
        <h3>Events on {selectedDate.toDateString()}</h3>
        {eventsForSelectedDate.length > 0 ? (
          <ul>
            {eventsForSelectedDate.map((event) => (
              <li key={event.id} style={{ marginBottom: '1.5rem' }}>
                <strong>{event.name}</strong> <br />
                <em>{event.time}</em> <br />
                <span>{event.description}</span>
                <br />
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditEventId(event.id);
                    setFormData({
                      title: event.name,
                      description: event.description,
                      time: event.time,
                    });
                    setShowForm(true);
                  }}
                  style={{ marginRight: '8px' }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events yet.</p>
        )}
      </div>
    </div>
  );
};

export default SchoolCalendar;
