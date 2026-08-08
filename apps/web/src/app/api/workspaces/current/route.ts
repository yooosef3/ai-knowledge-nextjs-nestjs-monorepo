import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const nestResponse = await fetch(`${API_URL}/workspaces/current`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!nestResponse.ok) {
    return Response.json({ message: 'Failed to load workspace' }, { status: nestResponse.status });
  }

  return Response.json(await nestResponse.json());
}