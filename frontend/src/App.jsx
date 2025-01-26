import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'

import NavBar from './NavBar'
import Home from './Home';
import Clients from './Clients';
import Instructors from './Instructors';
import Sessions from './Sessions';
import { BackendProvider } from './BackendProvider';


function App() {

  const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

  return (
      <BackendProvider url={BACKEND_ENDPOINT}>
        <Router>
          <NavBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/instructors' element={<Instructors />} />
            <Route path='/sessions' element={<Sessions />} />
          </Routes>
        </Router>
      </BackendProvider>
  )
}

export default App
