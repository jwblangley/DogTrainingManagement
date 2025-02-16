import dayjs from 'dayjs';

import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, Stack, Typography, Paper, TextField } from '@mui/material';
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
            notes
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


    const Instructorcolumns = [
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
                        <DataGrid
                            rows={instructors.filter(i => instructorIds.includes(i.id))}
                            columns={Instructorcolumns}
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
