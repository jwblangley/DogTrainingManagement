import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'


import './App.css'

import { Paper } from '@mui/material';

import NavBar from './NavBar'
import Home from './Home';
import Clients from './Clients';
import Dogs from './Dogs';
import Instructors from './Instructors';
import Sessions from './Sessions';
import Session from './Session';
import Finances from './Finances';
import { BackendProvider } from './BackendProvider';


dayjs.extend(updateLocale)

// strict thresholds
const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y', r: 1 },
  { l: 'yy', d: 'year' }
]

dayjs.extend(relativeTime, { thresholds, rounding: Math.floor })

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years"
  }
})


function App() {

  const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

  return (
      <BackendProvider url={BACKEND_ENDPOINT}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <Router>
            <NavBar />
            <Paper className="bodyPaper">
              <Routes>
                <Route index               element={<Home />} />
                <Route path='*'            element={<Home />} />
                <Route path='/clients'     element={<Clients />} />
                <Route path='/dogs'        element={<Dogs />} />
                <Route path='/instructors' element={<Instructors />} />
                <Route path='/sessions'    element={<Sessions />} />
                <Route path='/session'     element={<Session />} />
                <Route path='/finances'    element={<Finances />} />
              </Routes>
            </Paper>
          </Router>
        </LocalizationProvider>
      </BackendProvider>
  )
}

export default App
