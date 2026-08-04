'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import Button from '@mui/material/Button';
import { useSession } from '@/hooks/useSession';
import { useLogout } from '@/hooks/useLogout';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AppShell');
  const { data: user } = useSession();
  const logout = useLogout();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('title')}
          </Typography>
          {user ? (
            <Button color="inherit" onClick={() => logout.mutate()}>Log out ({user.email})</Button>
          ) : (
            <Button color="inherit" href="/login">Log in</Button>
          )}
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4 }}>{children}</Container>
    </Box>
  );
}