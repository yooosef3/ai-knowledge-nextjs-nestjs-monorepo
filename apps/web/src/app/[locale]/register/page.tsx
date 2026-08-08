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
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useRegister } from '@/hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '@/lib/auth-schemas';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (values: RegisterFormValues) =>
    registerUser.mutate(values, { onSuccess: () => router.push('/documents') });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: { xs: 4, sm: 10 } }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 44, height: 44, mb: 1.5 }}>
            <PersonAddAltOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Create an account</Typography>
          <Typography variant="body2" color="text.secondary">Start building your knowledge base</Typography>
        </Box>

        {registerUser.isError && <Alert severity="error" sx={{ mb: 2 }}>{registerUser.error.message}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} {...register('name')} />
          <TextField label="Email" fullWidth sx={{ mb: 2 }} {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 3 }} {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={registerUser.isPending}>
            {registerUser.isPending ? 'Creating account…' : 'Create account'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
          Already have an account? <Link href="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}