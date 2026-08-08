'use client';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useCurrentWorkspace, useSwitchWorkspace, useWorkspaces } from '@/hooks/useWorkspaces';

export default function WorkspaceSwitcher() {
  const { data: workspaces } = useWorkspaces();
  const { data: current } = useCurrentWorkspace();
  const switchWorkspace = useSwitchWorkspace();

  if (!workspaces || workspaces.length < 2) return null;

  return (
    <FormControl size="small" sx={{ minWidth: 140, mr: 1 }}>
      <Select
        value={current?.id || ''}
        onChange={(e) => switchWorkspace.mutate(e.target.value)}
        sx={{
          bgcolor: 'rgba(26, 36, 33, 0.04)',
          borderRadius: 2,
          fontSize: 13,
          fontWeight: 600,
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
        }}
      >
        {workspaces.map((w: { id: string; name: string }) => (
          <MenuItem key={w.id} value={w.id}>
            {w.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
