'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useLogin } from '@/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/lib/auth-schemas';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) =>
    login.mutate(values, { onSuccess: () => router.push('/documents') });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: { xs: 4, sm: 10 } }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, mb: 1.5 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Welcome back</Typography>
          <Typography variant="body2" color="text.secondary">Log in to your knowledge base</Typography>
        </Box>

        {login.isError && <Alert severity="error" sx={{ mb: 2 }}>{login.error.message}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Email" fullWidth sx={{ mb: 2 }} {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 3 }} {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={login.isPending}>
            {login.isPending ? 'Logging in…' : 'Log in'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
          No account? <Link href="/register">Create one</Link>
        </Typography>
      </Paper>
    </Box>
  );
}