const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(body.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export interface Document {
  id: string;
  title: string;
  fileUrl: string;
  workspaceId: string;
  uploadedById: string;
  createdAt: string;
  chunkCount?: number;
}

export const api = {
  login: (email: string, password: string) =>
    apiFetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name?: string) =>
    apiFetch<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  me: (token: string) =>
    apiFetch<{ userId: string; email: string; workspaceId?: string }>('/auth/me', { token }),

  getDocuments: (token: string) => apiFetch<Document[]>('/documents', { token }),

  uploadDocument: (file: File, workspaceId: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);
    return apiFetch<Document>('/documents/upload', { method: 'POST', body: formData, token });
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      return res.json();
    }),

  register: (email: string, password: string, name?: string) =>
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      return res.json();
    }),

  me: () =>
    fetch('/api/auth/me').then((res) => (res.ok ? res.json() : null)),

  logout: () => fetch('/api/auth/logout', { method: 'POST' }),
};