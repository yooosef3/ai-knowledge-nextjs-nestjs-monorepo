import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session'] }),
  });
}