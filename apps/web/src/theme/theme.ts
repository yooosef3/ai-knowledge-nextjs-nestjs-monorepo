'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E6F6E', // deep teal — distinct from MUI's default blue
    },
    secondary: {
      main: '#7A4FE0', // violet accent
    },
    background: {
      default: '#F7F7F5',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none' }, // MUI defaults to UPPERCASE buttons — most modern apps don't
  },
});

export default theme;