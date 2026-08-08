'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (_: React.MouseEvent<HTMLElement>, newLocale: string | null) => {
    if (!newLocale || newLocale === locale) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={locale}
      onChange={switchLocale}
      aria-label="language"
      sx={{
        bgcolor: 'rgba(26, 36, 33, 0.04)',
        borderRadius: 2,
        '& .MuiToggleButton-root': {
          border: 0,
          px: 1.25,
          py: 0.4,
          fontSize: 12,
          fontWeight: 700,
          color: 'text.secondary',
          '&.Mui-selected': {
            bgcolor: 'background.paper',
            color: 'primary.main',
            boxShadow: '0 1px 3px rgba(26, 36, 33, 0.08)',
            '&:hover': { bgcolor: 'background.paper' },
          },
        },
      }}
    >
      <ToggleButton value="en">EN</ToggleButton>
      <ToggleButton value="fa">فا</ToggleButton>
    </ToggleButtonGroup>
  );
}
