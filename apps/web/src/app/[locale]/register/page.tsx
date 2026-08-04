'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useRegister } from '@/hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '@/lib/auth-schemas';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (values: RegisterFormValues) => {
    registerUser.mutate(values, { onSuccess: () => router.push('/documents-test') });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Create an account</Typography>

      {registerUser.isError && <Alert severity="error" sx={{ mb: 2 }}>{registerUser.error.message}</Alert>}

      <TextField label="Name" fullWidth sx={{ mb: 2 }} {...register('name')} />
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

      <Button type="submit" variant="contained" fullWidth disabled={registerUser.isPending}>
        {registerUser.isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </Box>
  );
}