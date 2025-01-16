import { createTheme } from '@mui/material/styles';


export default createTheme({
    palette: {
        primary: {
            light: '#e57373',
            dark: '#b71c1c',
            main: '#c2185b',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#e1bee7',
            dark: '#7b1fa2',
            main: '#9575cd',
            contrastText: '#ffffff',
        },
        success: {
            light: '#00f563',
            dark: '#007E33',
            main: '#00C851',
            contrastText: '#ffffff',
        },
        error: {
            light: '#ff8888',
            dark: '#CC0000',
            main: '#ff4444',
            contrastText: '#ffffff',
        },
        type: 'light',
    },
})
