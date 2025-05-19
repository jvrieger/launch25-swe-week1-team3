import React from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react'

const SchoolCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <div style = {{ padding: "1.5rem"}}>
            <h1>School Calender 2025-2026</h1>
            <p> Select a date to view events. </p>
            <Calendar onChange= {setSelectedDate} value={selectedDate} />
            <div style={{marginTop: "1rem"}}>
                <strong> Selected Date: </strong> {selectedDate.toDateString()}
            </div>
        </div>
    );
};

export default SchoolCalendar