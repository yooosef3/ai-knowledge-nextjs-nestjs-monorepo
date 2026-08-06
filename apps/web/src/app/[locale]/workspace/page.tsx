'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { useCurrentWorkspace, useInviteMember } from '@/hooks/useWorkspaces';

const inviteSchema = z.object({ email: z.string().email('Enter a valid email') });

export default function WorkspacePage() {
  const { data: workspace, isLoading } = useCurrentWorkspace();
  const invite = useInviteMember();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(inviteSchema) });

  if (isLoading || !workspace) return null;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>{workspace.name}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{workspace.members.length} member(s)</Typography>

      <List sx={{ mb: 4 }}>
        {workspace.members.map((m: { id: string; email: string; name?: string; role: string }) => (
          <ListItem key={m.id} divider>
            <ListItemText primary={m.name || m.email} secondary={m.email} />
            <Chip label={m.role} size="small" />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mb: 2 }}>Invite a member</Typography>
      {invite.isError && <Alert severity="error" sx={{ mb: 2 }}>{invite.error.message}</Alert>}
      {invite.isSuccess && <Alert severity="success" sx={{ mb: 2 }}>Member added.</Alert>}
      <Box
        component="form"
        onSubmit={handleSubmit((values) => invite.mutate(values.email, { onSuccess: () => reset() }))}
        sx={{ display: 'flex', gap: 1 }}
      >
        <TextField
          size="small"
          placeholder="colleague@example.com"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button type="submit" variant="contained" disabled={invite.isPending}>Invite</Button>
      </Box>
    </Box>
  );
}