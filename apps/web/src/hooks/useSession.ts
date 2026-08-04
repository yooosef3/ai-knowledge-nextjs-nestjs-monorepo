import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}