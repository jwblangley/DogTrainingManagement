import { useState, useEffect } from 'react'
import './App.css'

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT

function App() {
  const [name, setName] = useState("")

  useEffect(() => {
    fetch(`${BACKEND_ENDPOINT}/list-people`)
      .then(res => res.json())
      .then(data => {
        setName(`${data.first_name} ${data.last_name}`)
      })
  }, [])

  return (
    <div>
      <h1>Hello {name}</h1>
    </div>
  )
}

export default App
