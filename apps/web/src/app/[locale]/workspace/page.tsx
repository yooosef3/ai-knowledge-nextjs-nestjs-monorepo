'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useCurrentWorkspace, useInviteMember } from '@/hooks/useWorkspaces';

const inviteSchema = z.object({ email: z.string().email('Enter a valid email') });

export default function WorkspacePage() {
  const { data: workspace, isLoading } = useCurrentWorkspace();
  const invite = useInviteMember();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(inviteSchema) });

  if (isLoading || !workspace) return null;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>{workspace.name}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{workspace.members.length} member(s)</Typography>

      <Paper variant="outlined" sx={{ mb: 4 }}>
        <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
          {workspace.members.map((m: { id: string; email: string; name?: string; role: string }) => (
            <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14 }}>
                {(m.name || m.email)[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap>{m.name || m.email}</Typography>
                <Typography variant="caption" color="text.secondary">{m.email}</Typography>
              </Box>
              <Chip label={m.role} size="small" variant="outlined" />
            </Box>
          ))}
        </Stack>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>Invite a member</Typography>
      {invite.isError && <Alert severity="error" sx={{ mb: 2 }}>{invite.error.message}</Alert>}
      {invite.isSuccess && <Alert severity="success" sx={{ mb: 2 }}>Member added.</Alert>}
      <Box component="form" onSubmit={handleSubmit((values) => invite.mutate(values.email, { onSuccess: () => reset() }))}
        sx={{ display: 'flex', gap: 1 }}>
        <TextField size="small" placeholder="colleague@example.com" fullWidth
          {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />} disabled={invite.isPending} sx={{ flexShrink: 0 }}>
          Invite
        </Button>
      </Box>
    </Box>
  );
}