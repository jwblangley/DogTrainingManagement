import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'

import NavBar from './NavBar'
import Home from './Home';
import Clients from './Clients';
import Instructors from './Instructors';
import Sessions from './Sessions';


function App() {

  return (
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/instructors' element={<Instructors />} />
          <Route path='/sessions' element={<Sessions />} />
        </Routes>
      </Router>
  )
}

export default App
