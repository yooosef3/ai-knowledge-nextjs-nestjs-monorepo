import type { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#2E6F6E', light: '#5C9998', dark: '#1D4F4E', contrastText: '#FFFFFF' },
    secondary: { main: '#3D5A80', light: '#6B8AB0', dark: '#2A405C' },
    background: { default: '#F3F6F4', paper: '#FFFFFF' },
    text: { primary: '#1A2421', secondary: '#5B6B67' },
    divider: '#E0E6E2',
    success: { main: '#2E7D57' },
    warning: { main: '#C47A2A' },
    error: { main: '#C44536' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'var(--font-body), "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
    h5: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h6: { fontWeight: 600, lineHeight: 1.35 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 0% -20%, rgba(46, 111, 110, 0.08), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(61, 90, 128, 0.06), transparent)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 18 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        outlined: { borderColor: '#D5DDD8' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: {
          borderColor: '#E0E6E2',
          boxShadow: '0 1px 2px rgba(26, 36, 33, 0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          borderColor: '#E0E6E2',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            borderColor: '#C5D0CA',
            boxShadow: '0 4px 14px rgba(26, 36, 33, 0.06)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: '#FFFFFF' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(224, 230, 226, 0.9)',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
};

export default themeOptions;
