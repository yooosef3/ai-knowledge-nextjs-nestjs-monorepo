import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useUploadDocument(token: string, workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => api.uploadDocument(file, workspaceId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', token] });
    },
  });
}