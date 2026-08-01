'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale; // segments[0] is '' from the leading slash
    router.push(segments.join('/'));
  };

  return (
    <Select
      value={locale}
      onChange={(e) => switchLocale(e.target.value)}
      size="small"
      sx={{ color: 'inherit', '.MuiSvgIcon-root': { color: 'inherit' } }}
    >
      <MenuItem value="en">EN</MenuItem>
      <MenuItem value="fa">فا</MenuItem>
    </Select>
  );
}