import { useSearchParams } from 'react-router-dom';

import Typography from '@mui/material/Typography'


export default function Sessions() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")

    return (
        <div>
            <Typography>Session</Typography>
            <Typography>{id}</Typography>
        </div>
    )
}
