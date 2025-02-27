import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Box } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import theme from './theme';


export default function Instructors() {

    let backend = useContext(BackendContext)

    const [instructors, setInstructors] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [addingInstructor, setAddingInstructor] = useState(false);
    const [modifyingInstructor, setModifyingInstructor] = useState(false);
    const [deletingInstructors, setDeletingInstructors] = useState(false);

    const pullState = () => {
        backend.current.listInstructors().then(data => {
            setInstructors(data)
        })
    }

    const getInstructor = (instructorId) => {
        return instructors.find(i => i.id === instructorId)
    }

    useEffect(pullState, [])

    // TODO: show owed credits
    const columns = [
        { field: 'first_name', headerName: 'First name', width: 150 },
        { field: 'last_name', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email Address', width: 250 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
        {
            field: 'owed_credits', headerName: 'Owed credits', width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.row.owed_credits > 0 ? theme.palette.error.dark : theme.palette.success.dark,
                        fontWeight: params.row.owed_credits > 0 ? "bold" : "normal"
                    }}
                >
                    {params.value}
                </Box>
            )
        },
        {
            field: 'owed_credits_incl_pending', headerName: 'including upcoming', width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.row.owed_credits_incl_pending > 0 ? theme.palette.error.dark : theme.palette.success.dark,
                        fontWeight: params.row.owed_credits_incl_pending > 0 ? "bold" : "normal"
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

    const addInstructor = ({ firstName, lastName, email, phone }) => {
        backend.current.addNewInstructor({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setAddingInstructor(false)
            pullState()
        });
    }

    const modifyInstructor = (instructorId, { firstName, lastName, email, phone }) => {
        backend.current.modifyInstructor(instructorId, {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone,
        }).then(() => {
            setModifyingInstructor(false)
            setRowSelectionModel([])
            pullState()
        });
    }

    const markInstructorsActive = () => {
        const willActivate = rowSelectionModel.some(id => !getInstructor(id).active)
        backend.current.markInstructorsActive(rowSelectionModel, willActivate)
            .then(() => {
                setRowSelectionModel([])
                pullState()
            })
    }

    const deleteInstructors = () => {
        if (!confirm("Are you sure? This action is permanent and also affects historical records")) {
            return;
        }
        backend.current.deleteInstructors(rowSelectionModel)
            .then(() => {
                setRowSelectionModel([])
                setDeletingInstructors(false)
                pullState()
            })
    }

    return (
        <div>
            <Stack spacing={2} direction="row">
                <Typography variant="h4">Instructors</Typography>
                <Button
                    variant="contained"
                    onClick={() => { setAddingInstructor(true) }}
                    disabled={rowSelectionModel.length > 0}
                >
                    Add
                </Button>
                <Button
                    variant="contained"
                    onClick={() => { setModifyingInstructor(true) }}
                    disabled={rowSelectionModel.length !== 1}
                >
                    Modify
                </Button>
                <Button
                    variant="contained"
                    onClick={markInstructorsActive}
                    disabled={rowSelectionModel.length <= 0
                        || (rowSelectionModel.some(id => getInstructor(id).active)
                            && rowSelectionModel.some(id => !getInstructor(id).active))}
                >
                    Mark as {rowSelectionModel.some(id => !getInstructor(id).active) ? "active" : "inactive"}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setDeletingInstructors(true)}
                    disabled={rowSelectionModel.length <= 0}
                >
                    Delete
                </Button>
            </Stack>
            <br />
            <DataGrid
                rows={instructors}
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
                open={addingInstructor || modifyingInstructor}
                onClose={() => {
                    setAddingInstructor(false)
                    setModifyingInstructor(false)
                }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData).entries());
                        console.assert(addingInstructor != modifyingInstructor)
                        if (addingInstructor) {
                            addInstructor(formJson)
                        } else if (modifyingInstructor) {
                            modifyInstructor(rowSelectionModel[0], formJson)
                        }
                    },
                }}
            >
                <DialogTitle>{addingInstructor ? "Add New Instructor" : "Modify Instructor"}</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingInstructor ? getInstructor(rowSelectionModel[0]).first_name : ""}
                        slotProps={{
                            htmlInput: { maxLength: 255 }
                        }}
                    />
                    <TextField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingInstructor ? getInstructor(rowSelectionModel[0]).last_name : ""}
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
                        defaultValue={modifyingInstructor ? getInstructor(rowSelectionModel[0]).email : ""}
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
                        defaultValue={modifyingInstructor ? getInstructor(rowSelectionModel[0]).phone : ""}
                        slotProps={{
                            htmlInput: { maxLength: 31 }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        console.assert(addingInstructor != modifyingInstructor)
                        setAddingInstructor(false)
                        setModifyingInstructor(false)
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">{modifyingInstructor ? "Modify" : "Add"}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deletingInstructors}
                onClose={() => setDeletingInstructors(false)}
            >
                <DialogTitle>{"Delete Selected Instructor(s)?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Delete selected instructor(s)?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeletingInstructors(false)}
                    >Cancel
                    </Button>
                    <Button
                        onClick={deleteInstructors}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
