import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';

export default function Clients() {

    let backend = useContext(BackendContext)

    const [users, setUsers] = useState([])

    useEffect(() => {
        backend.current.listClients().then(data => {
          setUsers(data)
        })
    }, [])


    const columns = [
        { field: 'first_name', headerName: 'First name', width: 150 },
        { field: 'last_name', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email Address', width: 150 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
    ];

    return (
        <div>
            <Typography variant="h4">Clients</Typography>
            <br/>
            <DataGrid
                rows={users}
                columns={columns}
                initialState={{ pagination: { page: 0, pageSize: 10 } }}
                pageSizeOptions={[5, 10]}
            />
        </div>

    )
}
