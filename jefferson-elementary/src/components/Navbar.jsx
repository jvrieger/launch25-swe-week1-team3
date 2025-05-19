import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import tigerIcon from '../assets/logo.png'

const Navbar = () => {
  const location = useLocation() // This makes it so main nav bar doesn't show in home page
  const isHome = location.pathname === '/'

  return (
    <div>
      <header className="school-header">
        <img src={tigerIcon} alt="Tiger Logo" className="logo" />
        <Link to="/" className="school-name-link">
          <h1>Thomas Jefferson School</h1>
        </Link>
      </header>

      {!isHome && (
        <nav className="main-nav">
          <ul>
            <li><Link to="/directory">Directory</Link></li>
            <li><Link to="/dashboard">Class Dashboard</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Navbar
