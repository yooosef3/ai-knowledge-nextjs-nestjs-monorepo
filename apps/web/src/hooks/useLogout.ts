import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => queryClient.setQueryData(['session'], null),
  });
}