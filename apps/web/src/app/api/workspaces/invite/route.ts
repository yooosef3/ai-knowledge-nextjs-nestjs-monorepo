import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await req.json();

  const nestResponse = await fetch(`${API_URL}/workspaces/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email }),
  });

  const body = await nestResponse.json();
  return Response.json(body, { status: nestResponse.ok ? 200 : nestResponse.status });
}