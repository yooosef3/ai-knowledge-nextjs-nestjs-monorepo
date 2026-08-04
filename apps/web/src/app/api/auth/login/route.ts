import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const nestResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!nestResponse.ok) {
    const body = await nestResponse.json().catch(() => ({}));
    return Response.json({ message: body.message || 'Login failed' }, { status: nestResponse.status });
  }

  const { access_token } = await nestResponse.json();

  const cookieStore = await cookies();
  cookieStore.set('session', access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches JWT_EXPIRES_IN from Lesson 7
  });

  return Response.json({ success: true });
}