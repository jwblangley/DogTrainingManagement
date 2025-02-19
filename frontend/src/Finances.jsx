import dayjs from 'dayjs';

import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField } from '@mui/material';


export default function Finances() {

    let backend = useContext(BackendContext)

    const [finances, setFinances] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [addingFinance, setAddingFinance] = useState(false);
    const [modifyingFinance, setModifyingFinance] = useState(false);
    const [deletingFinances, setDeletingFinances] = useState(false);

    const [clients, setClients] = useState([])
    const [instructors, setInstructors] = useState([])

    const pullState = () => {
        backend.current.listFinances().then(data => {
            setFinances(data)
        })
        backend.current.listClients().then(data => {
            setClients(data)
        })
        backend.current.listInstructors().then(data => {
            setInstructors(data)
        })
    }

    const getFinance = (financeId) => {
        return finances.find(f => f.id === financeId)
    }

    useEffect(pullState, [])

    const concatenateName = (first, last) => `${`${first} ` || ''}${last || ''}`
    const getClient = (clientId) => {
        return clients.find(c => c.id === clientId)
    }
    const getInstructor = (instructorId) => {
        return instructors.find(i => i.id === instructorId)
    }

    const columns = [
        { field: 'date', headerName: 'Date', width: 100},
        { field: 'description', headerName: 'Description', width: 450 },
        { field: 'value', headerName: 'Value', width: 100,
            valueGetter: (value, row) => `${row.value > 0 ? '+' : ''}${row.value}`
        },
        { field: 'person', headerName: 'Client / Instructor', width: 250,
            valueGetter: (value, row) => {
                if (row.client_id) {
                    const client = getClient(row.client_id)
                    return concatenateName(client.first_name, client.last_name)
                }
                if (row.instructor_id) {
                    const instructor = getInstructor(row.instructor_id)
                    return concatenateName(instructor.first_name, instructor.last_name)
                }
            }
        },
        { field: 'session_credits', headerName: 'Session Credits', width: 150,
            valueGetter: (value, row) => row.session_credits || ''
        },

    ];

    const addFinance = ({ firstName, lastName, email, phone }) => {
        backend.current.addNewFinance({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setAddingFinance(false)
            pullState()
        });
    }

    const modifyFinance = (financeId, { firstName, lastName, email, phone }) => {
        backend.current.modifyFinance(financeId, {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setModifyingFinance(false)
            setRowSelectionModel([])
            pullState()
        });
    }

    const deleteFinances = () => {
        if (!confirm("Are you sure? This action is permanent and also affects historical records")) {
            return;
        }
        backend.current.deleteFinances(rowSelectionModel)
            .then(() => {
                setRowSelectionModel([])
                setDeletingFinances(false)
                pullState()
            })
    }

    return (
        <div>
            <Stack spacing={2} direction="row">
                <Typography variant="h4">Finances</Typography>
                <Button
                    variant="contained"
                    onClick={() => { setAddingFinance(true) }}
                    disabled={rowSelectionModel.length > 0}
                >
                    Add
                </Button>
                <Button
                    variant="contained"
                    onClick={() => { setModifyingFinance(true) }}
                    disabled={rowSelectionModel.length !== 1}
                >
                    Modify
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setDeletingFinances(true)}
                    disabled={rowSelectionModel.length <= 0}
                >
                    Delete
                </Button>
            </Stack>
            <br />
            <DataGrid
                rows={finances}
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
                initialState={{
                    pagination: { page: 0, pageSize: 10 },
                    sorting: {
                        sortModel: [{ field: "date", sort: 'desc' }],
                    },

                }}
                pageSizeOptions={[5, 10]}
            />
            <Dialog
                open={addingFinance || modifyingFinance}
                onClose={() => {
                    setAddingFinance(false)
                    setModifyingFinance(false)
                }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData).entries());
                        console.assert(addingFinance != modifyingFinance)
                        if (addingFinance) {
                            addFinance(formJson)
                        } else if (modifyingFinance) {
                            modifyFinance(rowSelectionModel[0], formJson)
                        }
                    },
                }}
            >
                <DialogTitle>{addingFinance ? "Add New Finance" : "Modify Finance"}</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).first_name : ""}
                    />
                    <TextField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).last_name : ""}
                    />
                    <TextField
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).email : ""}
                    />
                    <TextField
                        id="phone"
                        name="phone"
                        label="Contact Number"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).phone : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        console.assert(addingFinance != modifyingFinance)
                        setAddingFinance(false)
                        setModifyingFinance(false)
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">{modifyingFinance ? "Modify" : "Add"}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deletingFinances}
                onClose={() => setDeletingFinances(false)}
            >
                <DialogTitle>{"Delete Selected Finance(s)?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Delete selected finance(s)? Please note that this will also delete any dogs with this finance as their owner"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeletingFinances(false)}
                    >Cancel
                    </Button>
                    <Button
                        onClick={deleteFinances}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
