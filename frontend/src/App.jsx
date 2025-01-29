import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'

import { Paper } from '@mui/material';

import NavBar from './NavBar'
import Home from './Home';
import Clients from './Clients';
import Dogs from './Dogs';
import Instructors from './Instructors';
import Sessions from './Sessions';
import { BackendProvider } from './BackendProvider';


function App() {

  const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

  return (
      <BackendProvider url={BACKEND_ENDPOINT}>
        <Router>
          <NavBar />
          <Paper className="bodyPaper">
            <Routes>
              <Route path='/'            element={<Home />} />
              <Route path='/clients'     element={<Clients />} />
              <Route path='/dogs'        element={<Dogs />} />
              <Route path='/instructors' element={<Instructors />} />
              <Route path='/sessions'    element={<Sessions />} />
            </Routes>
          </Paper>
        </Router>
      </BackendProvider>
  )
}

export default App
