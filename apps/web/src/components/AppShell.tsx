'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const navItems = [
  { href: '/chat', key: 'chat' as const, icon: ChatBubbleIcon },
  { href: '/documents', key: 'documents' as const, icon: DescriptionOutlinedIcon },
  { href: '/workspace', key: 'workspace' as const, icon: GroupOutlinedIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AppShell');
  const { data: user } = useSession();
  const logout = useLogout();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (href: string) => pathname.includes(href);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 64, sm: 68 } }}>
          <Box
            component={Link}
            href={user ? '/chat' : '/'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 3 },
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' }, letterSpacing: '-0.02em' }}
            >
              {t('title')}
            </Typography>
          </Box>

          {user && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1 }}
            >
              {navItems.map(({ href, key, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Button
                    key={href}
                    component={Link}
                    href={href}
                    startIcon={<Icon fontSize="small" />}
                    color={active ? 'primary' : 'inherit'}
                    sx={{
                      bgcolor: active ? 'rgba(46, 111, 110, 0.1)' : 'transparent',
                      color: active ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        bgcolor: active ? 'rgba(46, 111, 110, 0.14)' : 'rgba(26, 36, 33, 0.04)',
                      },
                    }}
                  >
                    {t(key)}
                  </Button>
                );
              })}
            </Stack>
          )}

          <Box sx={{ flexGrow: user ? 0 : 1 }} />

          {user && <WorkspaceSwitcher />}
          <LanguageSwitcher />

          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'primary.main',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {user.email[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 200, borderRadius: 2 } } }}
              >
                <MenuItem disabled sx={{ opacity: '1 !important', py: 1.25 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    logout.mutate();
                    setAnchorEl(null);
                  }}
                >
                  <LogoutIcon fontSize="small" sx={{ me: 1 }} />
                  {t('logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={Link} href="/login" variant="contained">
              {t('login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
