'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useLogin } from '@/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/lib/auth-schemas';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, { onSuccess: () => router.push('/documents-test') });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Log in</Typography>

      {login.isError && <Alert severity="error" sx={{ mb: 2 }}>{login.error.message}</Alert>}

      <TextField
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        sx={{ mb: 3 }}
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button type="submit" variant="contained" fullWidth disabled={login.isPending}>
        {login.isPending ? 'Logging in…' : 'Log in'}
      </Button>
    </Box>
  );
}