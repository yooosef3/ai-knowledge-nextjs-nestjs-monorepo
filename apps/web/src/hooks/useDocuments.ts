import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useDocuments(token: string) {
  return useQuery({
    queryKey: ['documents', token],
    queryFn: () => api.getDocuments(token),
    enabled: !!token,
  });
}