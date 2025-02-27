import * as React from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import PetsIcon from '@mui/icons-material/Pets';

export default function NavBar() {

    const pages = ['clients', 'dogs', 'instructors', 'sessions', 'finances']

    // Don't use useNavigate as it does not respect onbeforeunload
    const navigate = (uri) => {
        window.location.href = `/${uri}`
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        onClick={() => navigate('#/home')}
                        sx={{ marginRight: 2 }}
                    >
                        <PetsIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => navigate(`#/${page}`)}
                                sx={{
                                    marginTop: 2,
                                    marginBottom: 2,
                                    color: 'white',
                                    display: 'block'
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
