import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarStyles.css';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const SchoolCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
  });

  const [events, setEvents] = useState([]);

  // Fetch events from Firebase on load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = snapshot.docs.map(doc => doc.data());
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Handle form submission: save to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      name: formData.title,
      description: formData.description,
      time: formData.time,
      date: selectedDate.toDateString(),
    };

    try {
      await addDoc(collection(db, 'events'), newEvent);
      setEvents(prev => [...prev, newEvent]);
      setFormData({ title: '', description: '', time: '' });
      setShowForm(false);
      alert('Event added to Firebase!');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Update form input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Filter events by selected date
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

      {/* Add Event Button */}
      <button
        className="floating-add-button"
        onClick={() => setShowForm(true)}
        title="Add Event"
      >
        +
      </button>

      {/*  Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Event for {selectedDate.toDateString()}</h2>
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
                <button className="submit-button" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event List */}
      <div className="event-list">
        <h3>Events on {selectedDate.toDateString()}</h3>
        {eventsForSelectedDate.length > 0 ? (
          <ul>
            {eventsForSelectedDate.map((event, index) => (
              <li key={index} style={{ marginBottom: '1.5rem' }}>
                <strong>{event.name}</strong> <br />
                <em>{event.time}</em> <br />
                <span>{event.description}</span>
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

