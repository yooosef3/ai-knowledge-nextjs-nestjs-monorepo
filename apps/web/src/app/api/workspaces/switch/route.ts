import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { workspaceId } = await req.json();

  const nestResponse = await fetch(`${API_URL}/workspaces/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ workspaceId }),
  });

  if (!nestResponse.ok) {
    const body = await nestResponse.json().catch(() => ({}));
    return Response.json({ message: body.message || 'Failed to switch workspace' }, { status: nestResponse.status });
  }

  const { access_token } = await nestResponse.json();
  cookieStore.set('session', access_token, {
    httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ success: true });
}