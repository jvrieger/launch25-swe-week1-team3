
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Calendar from './routes/Calendar'
import Directory from './routes/Directory'
import Dashboard from './routes/Dashboard'
import ClassPage from './routes/ClassPage'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/calendar" element={<Calendar />} />
		 <Route path="/classes/:classId" element={<ClassPage />} />
      </Routes>
    </>
  )
}

export default App