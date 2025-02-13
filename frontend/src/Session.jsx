import { useSearchParams } from 'react-router-dom';

import Typography from '@mui/material/Typography'


export default function Sessions() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")

    // TODO: do this conditionally
    window.onbeforeunload = () => "Are you sure?"
    // window.onbeforeunload = null

    return (
        <div>
            <Typography>Session</Typography>
            <Typography>{id}</Typography>
        </div>
    )
}
