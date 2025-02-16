import dayjs from 'dayjs';

import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, Stack, Typography, Paper, TextField, Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DataGrid } from '@mui/x-data-grid';

import ClearIcon from '@mui/icons-material/Clear';

import { BackendContext } from './BackendProvider';


export default function Sessions() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("id")

    let backend = useContext(BackendContext)

    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [dateTime, setDateTime] = useState(dayjs())

    const [instructors, setInstructors] = useState([])
    const [instructorIds, setInstructorIds] = useState([])
    const [instructorAutocomplete, setInstructorAutocomplete] = useState("")

    const [dogs, setDogs] = useState([])
    const [dogIds, setDogIds] = useState([])
    const [dogAutocomplete, setDogAutocomplete] = useState("")

    const [fieldsDirty, setFieldsDirty] = useState(false)
    const [deletingSession, setDeletingSession] = useState(false)


    const pullState = () => {
        backend.current.listSessionDetails(sessionId).then(data => {
            setTitle(data?.title)
            setNotes(data?.notes)
            setDateTime(dayjs(data?.date_time, "YYYY-MM-DDTHH:mm:ss"))
            setInstructorIds(data?.instructor_ids)
            setDogIds(data?.dog_ids)
        })

        backend.current.listInstructors().then(data => {
            setInstructors(data)
        })
        backend.current.listDogs().then(data => {
            setDogs(data)
        })
    }

    const saveSession = () => {
        backend.current.saveSession({
            id: sessionId,
            title,
            date_time: dateTime.format("YYYY-MM-DDTHH:mm:ss"),
            notes,
            instructor_ids: instructorIds,
            dog_ids: dogIds,
        }).then(() => setFieldsDirty(false))
    }

    const deleteSession = () => {
        backend.current.deleteSession(sessionId)
            .then(() => {window.location.href = "/sessions"})
    }

    const setOnBeforeUnload = () => {
        if (fieldsDirty) {
            window.onbeforeunload = () => "Are you sure?"
        } else {
            window.onbeforeunload = null
        }
    }

    useEffect(pullState, [])
    useEffect(setOnBeforeUnload, [fieldsDirty])

    const instructorColumns = [
        {
            field: 'full_name', headerName: 'Name', width: 250,
            valueGetter: (value, row) => `${`${row.first_name} ` || ''}${row.last_name || ''}`
        },
        { field: 'email', headerName: 'Email Address', width: 250 },
        { field: 'phone', headerName: 'Contact Number', width: 150 },
        {
            field: 'remove', headerName: 'Remove', width: 75,
            renderCell: (params) => (
                <div style={{ textAlign: "center" }}>
                    <ClearIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => {
                            setInstructorIds(prev => prev.filter(i => i !== params.row.id))
                            setFieldsDirty(true)
                        }}
                    />
                </div>
            )
        },
    ];

    const dogColumns = [
        { field: 'pet_name', headerName: 'Pet\'s name', width: 150 },
        {
            field: 'owner_full_name', headerName: 'Owner\'s name', width: 300,
            valueGetter: (value, row) => `${`${row.owner_first_name} ` || ''}${row.owner_last_name || ''}`
        },
        {
            field: 'age', headerName: 'Age', width: 150,
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
        {
            field: 'remove', headerName: 'Remove', width: 75,
            renderCell: (params) => (
                <div style={{ textAlign: "center" }}>
                    <ClearIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => {
                            setDogIds(prev => prev.filter(i => i !== params.row.id))
                            setFieldsDirty(true)
                        }}
                    />
                </div>
            )
        },
    ];


    return (
        <div>
            <Stack spacing={2} direction="row">
                <Button
                    variant="contained"
                    onClick={saveSession}
                    disabled={!fieldsDirty}
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setDeletingSession(true)}
                    disabled={fieldsDirty}
                >
                    Delete
                </Button>
                <Typography variant="h4">Session: {title}</Typography>
                <Dialog
                    open={deletingSession}
                    onClose={() => setDeletingSession(false)}
                >
                    <DialogTitle>{"Delete Session?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {"Delete this session? This action is permanent"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDeletingSession(false)}
                        >Cancel
                        </Button>
                        <Button
                            onClick={deleteSession}
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
            <br />
            <Stack spacing={2} direction="row">
                <Paper sx={{padding: 2, width: "50%"}}>
                    <Stack spacing={2} direction="column">
                        <TextField
                            required
                            label="Title"
                            value={title}
                            onChange={(e => {
                                setTitle(e.target.value)
                                setFieldsDirty(true)
                            })}
                            fullWidth
                            variant="standard"
                        />
                        <DateTimePicker
                            label="Date and Time"
                            slotProps={{ textField: { variant: "standard", required: true} }}
                            fullWidth
                            variant="standard"
                            value={dateTime}
                            onChange={newValue => {
                                setDateTime(newValue)
                                setFieldsDirty(true)
                            }}
                        />
                        <TextField
                            label="Notes"
                            multiline
                            minRows={3}
                            value={notes}
                            onChange={(e => {
                                setNotes(e.target.value)
                                setFieldsDirty(true)
                            })}
                            fullWidth
                            variant="standard"
                        />
                    </Stack>
                </Paper>
                <Paper sx={{padding: 2, width: "50%"}}>
                    <Stack spacing={2} direction="column">
                        <Typography variant="h5">Instructors</Typography>
                        <Autocomplete
                            options={instructors.filter(i => i.active && ! instructorIds.includes(i.id)).map(i => i.id)}
                            inputValue={instructorAutocomplete}
                            onInputChange={(e, v, reason) => {
                                if (reason === "input") {
                                    setInstructorAutocomplete(v)
                                }
                            }}
                            onChange={(e, v) => {
                                if (v !== null) {
                                    setInstructorIds(prev => [...prev, v])
                                    setInstructorAutocomplete("")
                                    setFieldsDirty(true)
                                }
                            }}
                            getOptionLabel={opt => {
                                if (opt === null) {
                                    return ""
                                }
                                const i = instructors.find(i => i.id === opt)
                                return `${`${i.first_name} ` || ''}${i.last_name || ''}`
                            }}
                            renderInput={(params) => <TextField {...params} label="Add an instructor" variant="standard" fullWidth/>}
                        />
                        <DataGrid
                            rows={instructors.filter(i => instructorIds.includes(i.id))}
                            columns={instructorColumns}
                            gridRowId={(row) => row.id}
                            disableRowSelectionOnClick
                            initialState={{
                                pagination: { page: 0, pageSize: 10 },
                            }}
                            pageSizeOptions={[5, 10]}
                        />
                    </Stack>
                </Paper>
            </Stack>
            <br />
            <Paper sx={{ padding: 2, width: "100%" }}>
                <Stack spacing={2} direction="column">
                    <Typography variant="h5">Dogs</Typography>
                    <Autocomplete
                        options={dogs.filter(d => d.active && !dogIds.includes(d.id)).map(d => d.id)}
                        inputValue={dogAutocomplete}
                        onInputChange={(e, v, reason) => {
                            if (reason === "input") {
                                setDogAutocomplete(v)
                            }
                        }}
                        onChange={(e, v) => {
                            if (v !== null) {
                                setDogIds(prev => [...prev, v])
                                setDogAutocomplete("")
                                setFieldsDirty(true)
                            }
                        }}
                        getOptionLabel={opt => {
                            if (opt === null) {
                                return ""
                            }
                            const d = dogs.find(d => d.id === opt)
                            return `${d.pet_name} (${`${d.owner_first_name} ` || ''}${d.owner_last_name || ''})`
                        }}
                        renderInput={(params) => <TextField {...params} label="Add a dog" variant="standard" fullWidth />}
                    />
                    <DataGrid
                        rows={dogs.filter(d => dogIds.includes(d.id))}
                        columns={dogColumns}
                        gridRowId={(row) => row.id}
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: { page: 0, pageSize: 10 },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </Stack>
            </Paper>
        </div>
    )
}
