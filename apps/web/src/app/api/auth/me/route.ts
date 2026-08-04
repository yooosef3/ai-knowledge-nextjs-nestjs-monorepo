import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return Response.json(null, { status: 401 });
  }

  const nestResponse = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!nestResponse.ok) {
    return Response.json(null, { status: 401 });
  }

  return Response.json(await nestResponse.json());
}