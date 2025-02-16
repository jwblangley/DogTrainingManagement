import dayjs from 'dayjs';

import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, Stack, Typography, Paper, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


import { BackendContext } from './BackendProvider';


export default function Sessions() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("id")

    let backend = useContext(BackendContext)

    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [dateTime, setDateTime] = useState(dayjs())

    const [fieldsDirty, setFieldsDirty] = useState(false)


    const pullState = () => {
        backend.current.listSessionDetails(sessionId).then(data => {
            setTitle(data?.title)
            setNotes(data?.notes)
            setDateTime(dayjs(data?.date_time, "YYYY-MM-DDTHH:mm:ss"))
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
                    Form
                </Paper>
            </Stack>
        </div>
    )
}
