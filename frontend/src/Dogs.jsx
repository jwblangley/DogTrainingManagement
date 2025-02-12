import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { BackendContext } from './BackendProvider';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, MenuItem, Autocomplete} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

dayjs.extend(relativeTime)

export default function Dogs() {

    let backend = useContext(BackendContext)

    const [dogs, setDogs] = useState([])
    const [clients, setClients] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [addingDog, setAddingDog] = useState(false);
    const [modifyingDog, setModifyingDog] = useState(false);
    const [deletingDogs, setDeletingDogs] = useState(false);
    const [selectedOwnerId, setSelectedOwnerId] = useState(null);

    const pullState = () => {
        backend.current.listDogsDetails().then(data => {
            setDogs(data)
        })
        backend.current.listClients().then(data => {
            setClients(data)
        })
    }

    const getDog = (dogId) => {
        return dogs.find(d => d.id === dogId)
    }

    useEffect(pullState, [])

    const columns = [
        { field: 'pet_name', headerName: 'Pet\'s name', width: 150 },
        { field: 'owner_full_name', headerName: 'Owner\'s name', width: 300,
            valueGetter: (value, row) => `${`${row.owner_first_name} ` || ''}${row.owner_last_name || ''}`
        },
        { field: 'age', headerName: 'Age', width: 150,
            valueGetter: (value, row) => {
                if (row.dob === null) {
                    return ""
                }

                return dayjs(row.dob, "YYYY-MM-DD").fromNow(true)
            }
        },
        { field: 'breed', headerName: 'Breed', width: 250 },
        { field: 'sex', headerName: 'Sex', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 400 },
        { field: 'active', headerName: 'Active', width: 75,
            renderCell: (params) => (
                <div style={{textAlign: "center"}}>
                    {params.row.active
                        ? <CheckCircleIcon color="primary" style={{transform: "translateY(6px)"}}/>
                        : <CancelIcon style={{transform: "translateY(6px)"}}/>}
                </div>
        )},
    ];

    const addDog = ({petName, ownerId, dob, breed, sex, notes}) => {
        backend.current.addNewDog({
            "pet_name": petName,
            "owner_id": ownerId,
            "dob": dob.length > 0 ? dayjs(dob, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
            "breed": breed,
            "sex": sex,
            "notes": notes,
        }).then(() => {
            setAddingDog(false)
            setSelectedOwnerId(null)
            pullState()
        });
    }

    const modifyDog = (dogId, {petName, ownerId, dob, breed, sex, notes}) => {
        backend.current.modifyDog(dogId, {
            "pet_name": petName,
            "owner_id": ownerId,
            "dob": dayjs(dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
            "breed": breed,
            "sex": sex,
            "notes": notes,
        }).then(() => {
            setModifyingDog(false)
            setSelectedOwnerId(null)
            setRowSelectionModel([])
            pullState()
        });
    }

    const markDogsActive = () => {
        const willActivate = rowSelectionModel.some(id => !getDog(id).active)
        backend.current.markDogsActive(rowSelectionModel, willActivate)
            .then(() => {
                setRowSelectionModel([])
                pullState()
            })
    }

    const deleteDogs = () => {
        if (!confirm("Are you sure? This action is permanent and also affects historical records")) {
            return;
        }
        backend.current.deleteDogs(rowSelectionModel)
            .then(() => {
                setRowSelectionModel([])
                setDeletingDogs(false)
                pullState()
            })
    }

    return (
        <div>
            <Stack spacing={2} direction="row">
                <Typography variant="h4">Dogs</Typography>
                <Button
                    variant="contained"
                    onClick={() => {setAddingDog(true)}}
                    disabled={rowSelectionModel.length > 0}
                >
                    Add
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setModifyingDog(true)
                        setSelectedOwnerId(getDog(rowSelectionModel[0]).owner_id)
                    }}
                    disabled={rowSelectionModel.length !== 1}
                >
                    Modify
                </Button>
                <Button
                    variant="contained"
                    onClick={markDogsActive}
                    disabled={rowSelectionModel.length <= 0
                        || (rowSelectionModel.some(id => getDog(id).active)
                            && rowSelectionModel.some(id => !getDog(id).active))}
                >
                    Mark as {rowSelectionModel.some(id => !getDog(id).active) ? "active" : "inactive"}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setDeletingDogs(true)}
                    disabled={rowSelectionModel.length <= 0}
                >
                    Delete
                </Button>
            </Stack>
            <br/>
            <DataGrid
                rows={dogs}
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
                open={addingDog || modifyingDog}
                onClose={() => {
                    setAddingDog(false)
                    setModifyingDog(false)
                    setSelectedOwnerId(null)
                }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = {...Object.fromEntries((formData).entries()), ownerId: selectedOwnerId};

                        console.assert(addingDog != modifyingDog)
                        if (addingDog) {
                            addDog(formJson)
                        } else if (modifyingDog) {
                            modifyDog(rowSelectionModel[0], formJson)
                        }
                    },
                }}
            >
                <DialogTitle>{addingDog ? "Add New Dog" : "Modify Dog"}</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="petName"
                        name="petName"
                        label="Pet's Name"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingDog ? getDog(rowSelectionModel[0]).pet_name : ""}
                    />
                    <Autocomplete
                        id="ownerId" name="ownerId"
                        options={clients.filter(c => c.active).map(c => c.id)}
                        value={selectedOwnerId}
                        onChange={(e, v) => setSelectedOwnerId(v)}
                        getOptionLabel={opt => {
                            if (opt === null) {
                                return ""
                            }
                            const c = clients.find(c => c.id === opt)
                            return `${`${c.first_name} ` || ''}${c.last_name || ''}`
                        }}
                        renderInput={(params) => <TextField {...params} label="Owner" variant="standard" fullWidth required/>}
                    />
                    <DatePicker
                        label="Date of Birth"
                        id="dob"
                        name="dob"
                        defaultValue={modifyingDog ? dayjs(getDog(rowSelectionModel[0]).dob, "YYYY-MM-DD") : null}
                        fullWidth
                        disableFuture
                        variant="standard"
                        sx={{
                            width: "100%"
                        }}
                        slotProps={{
                            textField: {
                                variant: "standard"
                            }
                        }}
                    />
                    <TextField
                        id="breed"
                        name="breed"
                        label="Breed"
                        fullWidth
                        variant="standard"
                        defaultValue={modifyingDog ? getDog(rowSelectionModel[0]).breed : ""}
                    />
                    <TextField
                        select
                        variant="standard"
                        fullWidth
                        id="sex"
                        name="sex"
                        label="Sex"
                        defaultValue={modifyingDog ? getDog(rowSelectionModel[0]).sex : ''}
                    >
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value={"Female (entire)"}>{"Female (entire)"}</MenuItem>
                        <MenuItem value={"Female (neutered)"}>{"Female (neutered)"}</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value={"Male (entire)"}>{"Male (entire)"}</MenuItem>
                        <MenuItem value={"Male (neutered)"}>{"Male (neutered)"}</MenuItem>
                    </TextField>
                    <TextField
                        id="notes"
                        name="notes"
                        label="Notes"
                        fullWidth
                        multiline
                        variant="standard"
                        defaultValue={modifyingDog ? getDog(rowSelectionModel[0]).notes : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        console.assert(addingDog != modifyingDog)
                        setAddingDog(false)
                        setModifyingDog(false)
                        setSelectedOwnerId(null)
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit">{modifyingDog ? "Modify" : "Add"}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deletingDogs}
                onClose={() => setDeletingDogs(false)}
            >
                <DialogTitle>{"Delete Selected Dog(s)?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Delete selected dog(s)?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeletingDogs(false)}
                    >Cancel
                    </Button>
                    <Button
                        onClick={deleteDogs}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
