import type { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#2E6F6E' },
    secondary: { main: '#7A4FE0' },
    background: { default: '#F7F7F5' },
  },
  shape: { borderRadius: 10 },
  typography: {
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
};

export default themeOptions;