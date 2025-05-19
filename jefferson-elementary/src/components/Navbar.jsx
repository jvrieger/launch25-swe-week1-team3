import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/directory">Directory</Link></li>
                <li><Link to="/calendar">Calendar</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar