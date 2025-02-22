import { useState, useEffect, useContext } from 'react';

import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { BackendContext } from './BackendProvider';
import { Button, Stack} from '@mui/material';



export default function Sessions() {

    let backend = useContext(BackendContext)

    const [sessions, setSessions] = useState([])

    const pullState = () => {
        backend.current.listSessions().then(data => {
            setSessions(data)
        })
    }

    const rowClick = (params) => {
        window.location.href = `/#/session?id=${params.row.id}`
    }

    useEffect(pullState, [])

    const columns = [
        { field: 'date', headerName: 'Date', width: 150,
            valueGetter: (value, row) => {
                return dayjs(row.date_time, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD")
            }
        },
        { field: 'time', headerName: 'Time', width: 150,
            valueGetter: (value, row) => {
                return dayjs(row.date_time, "YYYY-MM-DDTHH:mm:ss").format("HH:mm")
            }
        },
        { field: 'title', headerName: 'Title', width: 350 },
        { field: 'num_instructors', headerName: '# Instructors', width: 150 },
        { field: 'num_dogs', headerName: '# Dogs', width: 150 },
        { field: 'num_clients', headerName: '# Clients', width: 150 },
    ];

    return (
        <div>
            <Stack spacing={2} direction="row">
                <Typography variant="h4">Sessions</Typography>
                <Button
                    variant="contained"
                    href="/#/session?id=new"
                >
                    Add
                </Button>
            </Stack>
            <br />
            <DataGrid
                rows={sessions}
                columns={columns}
                gridRowId={(row) => row.id}
                disableRowSelectionOnClick
                onRowClick={rowClick}
                getRowClassName={params => dayjs(params.row.date_time, "YYYY-MM-DDTHH:mm:ss") > dayjs() ? "" : "rowInactive"}
                sx = {{
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer'
                    }
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={{
                    pagination: { page: 0, pageSize: 10 },
                    sorting: {
                        sortModel: [{ field: "date", sort: 'desc' }],
                    },

                }}
                pageSizeOptions={[5, 10]}
            />
        </div>

    )
}
