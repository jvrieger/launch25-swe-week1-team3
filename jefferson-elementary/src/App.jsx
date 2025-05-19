import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import SchoolCalendar from './routes/Calendar'
import Directory from './routes/Directory'
import Dashboard from './routes/Dashboard'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/calendar" element={<SchoolCalendar />} />
      </Routes>
    </>
  )
}

export default App