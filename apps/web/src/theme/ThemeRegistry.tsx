'use client';

import { useMemo } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import baseThemeOptions from './theme';

export default function ThemeRegistry({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: 'ltr' | 'rtl';
}) {
  const theme = useMemo(
    () => createTheme({ ...baseThemeOptions, direction }),
    [direction],
  );

  return (
    <AppRouterCacheProvider
      options={{
        key: direction === 'rtl' ? 'muirtl' : 'mui',
        stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [prefixer],
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}