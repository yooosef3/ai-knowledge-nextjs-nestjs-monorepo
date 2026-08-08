'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslations } from 'next-intl';
import { useSession } from '@/hooks/useSession';
import { useLogout } from '@/hooks/useLogout';
import LanguageSwitcher from './LanguageSwitcher';
import WorkspaceSwitcher from './WorkspaceSwitcher';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AppShell');
  const { data: user } = useSession();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="transparent" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>{t('title')}</Typography>

          {user && (
            <Stack direction="row" spacing={0.5} sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}>
              <Button component={Link} href="/chat" startIcon={<ChatBubbleIcon fontSize="small" />} color="inherit">Chat</Button>
              <Button component={Link} href="/documents" startIcon={<DescriptionOutlinedIcon fontSize="small" />} color="inherit">Documents</Button>
              <Button component={Link} href="/workspace" startIcon={<GroupOutlinedIcon fontSize="small" />} color="inherit">Workspace</Button>
            </Stack>
          )}

          {user && <WorkspaceSwitcher />}
          <LanguageSwitcher />

          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                  {user.email[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { logout.mutate(); setAnchorEl(null); }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Log out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={Link} href="/login" variant="contained">Log in</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 5 }}>{children}</Container>
    </Box>
  );
}