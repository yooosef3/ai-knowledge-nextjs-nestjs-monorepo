import type { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#2E6F6E', light: '#5C9998', dark: '#1D4F4E' },
    secondary: { main: '#7A4FE0' },
    background: { default: '#F6F7F5', paper: '#FFFFFF' },
    text: { primary: '#1A2421', secondary: '#5B6B67' },
    divider: '#E3E7E4',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'var(--font-inter), "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 18 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: '#E3E7E4' },
      },
    },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none', borderBottom: '1px solid #E3E7E4' } } },
  },
};

export default themeOptions;