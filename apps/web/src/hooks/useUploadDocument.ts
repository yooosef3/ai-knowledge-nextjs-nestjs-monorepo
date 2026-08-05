import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api-client';

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => documentsApi.upload(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}