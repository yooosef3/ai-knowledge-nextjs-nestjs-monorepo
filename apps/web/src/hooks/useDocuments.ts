import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api-client';

export function useDocuments() {
  return useQuery({ queryKey: ['documents'], queryFn: documentsApi.getAll });
}