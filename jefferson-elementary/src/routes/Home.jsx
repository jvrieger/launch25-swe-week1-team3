import React from 'react'
import '../styles/Home.css'
import { Link } from 'react-router-dom'

import { FaUserFriends, FaPenNib, FaCalendarAlt } from 'react-icons/fa'

const Home = () => {
  return (
    <div className="home">
    
    <div className='card-wrapper'>
    <div className="card-container">
        <Link to="/directory" className="card-link">
        <div className="card" style={{ backgroundColor: 'rgba(33, 150, 243, 0.85)' }}>
            <FaUserFriends className="icon" />
            <p>Directory</p>
        </div>
        </Link>

        <Link to="/dashboard" className="card-link">
        <div className="card" style={{ backgroundColor: 'rgba(255, 152, 0, 0.85)' }}>
            <FaPenNib className="icon" />
            <p>Classes</p>
        </div>
        </Link>

        <Link to="/calendar" className="card-link">
        <div className="card" style={{ backgroundColor: 'rgba(244, 67, 54, 0.85)' }}>
            <FaCalendarAlt className="icon" />
            <p>Calendar</p>
        </div>
        </Link>
    </div>
    </div>

    </div>
  )
}

export default Home
