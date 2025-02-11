import { useContext } from 'react';

import { Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { BackendContext } from './BackendProvider';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';



export default function Home() {

    let backend = useContext(BackendContext)

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });


    return (
        <div>
            <Typography variant="h2">Welcome</Typography>
            <br />
            <Typography variant="h4">to the Dog Training Management System</Typography>
            <br />
            <Typography>Use the tabs in the navigation bar to get started.</Typography>
            <br />
            <hr />
            <br />
            <Stack spacing={2} direction="row">
                <Button
                    variant="contained"
                    onClick={() => backend.current.createBackup()}
                >
                    Create Backup
                </Button>
                <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Restore Backup
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => {
                            if (!confirm("Are you sure? This will replace all data. Please make a second backup first."))
                            {
                                return
                            }
                            let formData = new FormData();

                            formData.append("backup", event.target.files[0]);
                            backend.current.restoreBackup(formData)
                                .then((resp) => alert(`Restore from backup ${resp.status === 200 ? "successful" : "unsuccessful"}`))
                        }}
                    />
                </Button>
            </Stack>
            <br />
        </div>
    )
}
