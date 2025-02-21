import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Box } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import theme from './theme';


export default function Clients() {

    let backend = useContext(BackendContext)

    const [clients, setClients] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [addingClient, setAddingClient] = useState(false);
    const [modifyingClient, setModifyingClient] = useState(false);
    const [deletingClients, setDeletingClients] = useState(false);

    const pullState = () => {
        backend.current.listClients().then(data => {
            setClients(data)
        })
    }

    const getClient = (clientId) => {
        return clients.find(c => c.id === clientId)
    }

    useEffect(pullState, [])

    const columns = [
        { field: 'first_name', headerName: 'First name', width: 150 },
        { field: 'last_name', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email Address', width: 250 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
        { field: 'remaining_credits', headerName: 'Remaining credits', width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.row.remaining_credits >= 0 ? theme.palette.success.dark : theme.palette.error.dark,
                        fontWeight: params.row.remaining_credits >= 0 ? "normal" : "bold"
                    }}
                >
                    {params.value}
                </Box>
            )
         },
        { field: 'remaining_credits_incl_pending', headerName: 'including upcoming', width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.row.remaining_credits_incl_pending >= 0 ? theme.palette.success.dark : theme.palette.error.dark,
                        fontWeight: params.row.remaining_credits_incl_pending >= 0 ? "normal" : "bold"
                    }}
                >
                    {params.value}
                </Box>
            )
         },
        { field: 'active', headerName: 'Active', width: 100,
            renderCell: (params) => (
                <div style={{textAlign: "center"}}>
                    {params.row.active
                        ? <CheckCircleIcon color="primary" style={{transform: "translateY(6px)"}}/>
                        : <CancelIcon style={{transform: "translateY(6px)"}}/>}
                </div>
        )},

    ];

    const addClient = ({firstName, lastName, email, phone}) => {
        backend.current.addNewClient({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setAddingClient(false)
            pullState()
        });
    }

    const modifyClient = (clientId, {firstName, lastName, email, phone}) => {
        backend.current.modifyClient(clientId, {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setModifyingClient(false)
            setRowSelectionModel([])
            pullState()
        });
    }

    const markClientsActive = () => {
        const willActivate = rowSelectionModel.some(id => !getClient(id).active)
        backend.current.markClientsActive(rowSelectionModel, willActivate)
            .then(() => {
                setRowSelectionModel([])
                pullState()
            })
    }

    const deleteClients = () => {
        if (!confirm("Are you sure? This action is permanent and also affects historical records")) {
            return;
        }
        backend.current.deleteClients(rowSelectionModel)
            .then(() => {
                setRowSelectionModel([])
                setDeletingClients(false)
                pullState()
            })
    }

    return (
        <div>
            <Stack spacing={2} direction="row">
                <Typography variant="h4">Clients</Typography>
                <Button
                    variant="contained"
                    onClick={() => {setAddingClient(true)}}
                    disabled={rowSelectionModel.length > 0}
                >
                    Add
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {setModifyingClient(true)}}
                    disabled={rowSelectionModel.length !== 1}
                >
                    Modify
                </Button>
                <Button
                    variant="contained"
                    onClick={markClientsActive}
                    disabled={rowSelectionModel.length <= 0
                            || (rowSelectionModel.some(id => getClient(id).active)
                                && rowSelectionModel.some(id => !getClient(id).active))}
                >
                    Mark as {rowSelectionModel.some(id => !getClient(id).active) ? "active" : "inactive"}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setDeletingClients(true)}
                    disabled={rowSelectionModel.length <= 0}
                >
                    Delete
                </Button>
            </Stack>
            <br/>
            <DataGrid
                rows={clients}
                columns={columns}
                gridRowId={(row) => row.id}
                checkboxSelection
                disableRowSelectionOnClick
                getRowClassName={params => params.row.active ? "" : "rowInactive"}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={{
                    pagination: { page: 0, pageSize: 10 },
                    sorting: {
                        sortModel: [{ field: "active", sort: 'desc' }],
                    },

                }}
                pageSizeOptions={[5, 10]}
            />
            <Dialog
                open={addingClient || modifyingClient}
                onClose={() => {
                    setAddingClient(false)
                    setModifyingClient(false)
                }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData).entries());
                        console.assert(addingClient != modifyingClient)
                        if (addingClient) {
                            addClient(formJson)
                        } else if (modifyingClient) {
                            modifyClient(rowSelectionModel[0], formJson)
                        }
                    },
                }}
            >
                <DialogTitle>{addingClient ? "Add New Client" : "Modify Client"}</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingClient ? getClient(rowSelectionModel[0]).first_name : ""}
                        slotProps={{
                            htmlInput: {maxLength: 255}
                        }}
                    />
                    <TextField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingClient ? getClient(rowSelectionModel[0]).last_name : ""}
                        slotProps={{
                            htmlInput: { maxLength: 255 }
                        }}
                    />
                    <TextField
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingClient ? getClient(rowSelectionModel[0]).email : ""}
                        slotProps={{
                            htmlInput: { maxLength: 511 }
                        }}
                    />
                    <TextField
                        id="phone"
                        name="phone"
                        label="Contact Number"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingClient ? getClient(rowSelectionModel[0]).phone : ""}
                        slotProps={{
                            htmlInput: { maxLength: 31 }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        console.assert(addingClient != modifyingClient)
                        setAddingClient(false)
                        setModifyingClient(false)
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">{modifyingClient ? "Modify" : "Add"}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deletingClients}
                onClose={() => setDeletingClients(false)}
            >
                <DialogTitle>{"Delete Selected Client(s)?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Delete selected client(s)? Please note that this will also delete any dogs with this client as their owner"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeletingClients(false)}
                    >Cancel
                    </Button>
                    <Button
                        onClick={deleteClients}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
