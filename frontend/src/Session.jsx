import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import Typography from '@mui/material/Typography'

import { BackendContext } from './BackendProvider';


export default function Sessions() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("id")

    let backend = useContext(BackendContext)

    const pullState = () => {
        backend.current.listSessionDetails(sessionId).then(data => {
            setSession(data)
        })
    }

    const [session, setSession] = useState([])


    const markFormDirty = (dirty) => {
        if (dirty) {
            window.onbeforeunload = () => "Are you sure?"
        } else {
            window.onbeforeunload = null
        }
    }

    useEffect(pullState, [])

    return (
        <div>
            <Typography variant="h4">Session: {session && session.title}</Typography>
            <Typography>{sessionId}</Typography>
        </div>
    )
}
