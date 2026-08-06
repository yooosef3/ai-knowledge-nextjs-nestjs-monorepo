import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => fetch('/api/workspaces/mine').then((r) => r.json()),
  });
}

export function useCurrentWorkspace() {
  return useQuery({
    queryKey: ['workspace', 'current'],
    queryFn: () => fetch('/api/workspaces/current').then((r) => r.json()),
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) =>
      fetch('/api/workspaces/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).message || 'Invite failed');
        return res.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workspace', 'current'] }),
  });
}

export function useSwitchWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) =>
      fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      }).then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).message || 'Switch failed');
        return res.json();
      }),
    onSuccess: () => queryClient.invalidateQueries(), // new workspace → every cached query is now stale
  });
}