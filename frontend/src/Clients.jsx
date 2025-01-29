import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function Clients() {

    let backend = useContext(BackendContext)

    const [users, setUsers] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [addingClient, setAddingClient] = useState(false);

    const pullState = () => {
        backend.current.listClientsDetails().then(data => {
            setUsers(data)
        })
    }

    useEffect(pullState, [])

    const columns = [
        { field: 'first_name', headerName: 'First name', width: 150 },
        { field: 'last_name', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email Address', width: 250 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
    ];

    const addClient = ({firstName, lastName, email, phone}) => {
        backend.current.addNewClient({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setAddingClient(false)
            backend.current.listClientsDetails().then(data => {
                setUsers(data)
            })
        });
    }

    return (
        <div>
            <Stack spacing={2} direction="row">
                <Typography variant="h4">Clients</Typography>
                <Button
                    variant="contained"
                    onClick={() => {setAddingClient(true)}}
                >
                    Add
                </Button>
            </Stack>
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
            <Dialog
                open={addingClient}
                onClose={() => {setAddingClient(false)}}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData).entries());
                        addClient(formJson)
                    },
                }}
            >
                <DialogTitle>Add New Client</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        id="phone"
                        name="phone"
                        label="Contact Number"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddingClient(false)}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
