'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useRegister } from '@/hooks/useRegister';
import { createRegisterSchema, type RegisterFormValues } from '@/lib/auth-schemas';

export default function RegisterPage() {
  const t = useTranslations('Register');
  const tv = useTranslations('Validation');
  const router = useRouter();
  const registerUser = useRegister();

  const schema = useMemo(
    () =>
      createRegisterSchema({
        email: tv('email'),
        passwordRequired: tv('passwordRequired'),
        passwordMin: tv('passwordMin'),
      }),
    [tv],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: RegisterFormValues) =>
    registerUser.mutate(values, { onSuccess: () => router.push('/documents') });

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: { xs: 2, sm: 8 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48, mb: 1.75 }}>
            <PersonAddAltOutlinedIcon />
          </Avatar>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {t('title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        {registerUser.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {registerUser.error.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField label={t('name')} fullWidth sx={{ mb: 2 }} {...register('name')} />
          <TextField
            label={t('email')}
            fullWidth
            sx={{ mb: 2 }}
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label={t('password')}
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={registerUser.isPending}>
            {registerUser.isPending ? t('submitting') : t('submit')}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
          {t('hasAccount')}{' '}
          <Box component={Link} href="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
            {t('logIn')}
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
}
