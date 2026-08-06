'use client';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useCurrentWorkspace, useSwitchWorkspace, useWorkspaces } from '@/hooks/useWorkspaces';

export default function WorkspaceSwitcher() {
  const { data: workspaces } = useWorkspaces();
  const { data: current } = useCurrentWorkspace();
  const switchWorkspace = useSwitchWorkspace();

  if (!workspaces || workspaces.length < 2) return null; // most users only ever have one — stay invisible until it matters

  return (
    <Select
      value={current?.id || ''}
      onChange={(e) => switchWorkspace.mutate(e.target.value)}
      size="small"
      sx={{ color: 'inherit', mr: 2, '.MuiSvgIcon-root': { color: 'inherit' } }}
    >
      {workspaces.map((w: { id: string; name: string }) => (
        <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
      ))}
    </Select>
  );
}