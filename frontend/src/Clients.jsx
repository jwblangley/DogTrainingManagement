import { useState, useEffect, useContext } from 'react'

import Typography from '@mui/material/Typography'

import { BackendContext } from './BackendProvider'

export default function Clients() {

    let backend = useContext(BackendContext)

    const [users, setUsers] = useState([])

    useEffect(() => {
        backend.current.listClients().then(data => {
          setUsers(data)
        })
    }, [])

    return (
        <Typography>Clients</Typography>
    )
}
