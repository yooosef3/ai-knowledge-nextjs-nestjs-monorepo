import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';
import type { RegisterFormValues } from '@/lib/auth-schemas';

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      authApi.register(values.email, values.password, values.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session'] }),
  });
}