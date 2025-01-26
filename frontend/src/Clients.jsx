import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';

export default function Clients() {

    let backend = useContext(BackendContext)

    const [users, setUsers] = useState([])

    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    useEffect(() => {
        backend.current.listClientsDetails().then(data => {
          setUsers(data)
        })
    }, [])

    const columns = [
        { field: 'first_name', headerName: 'First name', width: 150 },
        { field: 'last_name', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email Address', width: 250 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
    ];

    return (
        <div>
            <Typography variant="h4">Clients</Typography>
            <br/>
            <DataGrid
                rows={users}
                columns={columns}
                gridRowId={(row) => row.id}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={{ pagination: { page: 0, pageSize: 10 } }}
                pageSizeOptions={[5, 10]}
            />
        </div>

    )
}
