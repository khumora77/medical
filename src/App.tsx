import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Doctor from './pages/doctor'
import Auth from './pages/auth'
import Reception from './pages/reception'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/doctor' element={<Doctor/>}/>
        <Route path='/reception' element={<Reception/>}/>
      </Routes>
    </div>
  )
}

export default App