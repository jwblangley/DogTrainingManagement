import dayjs from 'dayjs';

import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, Stack, Typography, Paper, TextField, Autocomplete } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DataGrid } from '@mui/x-data-grid';

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

    const [fieldsDirty, setFieldsDirty] = useState(false)


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
            instructor_ids: instructorIds
        }).then(() => setFieldsDirty(false))
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
                <Typography variant="h4">Session: {title}</Typography>
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
        </div>
    )
}
