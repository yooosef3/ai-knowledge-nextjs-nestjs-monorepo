import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();

  const nestResponse = await fetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const body = await nestResponse.json();
  return Response.json(body, { status: nestResponse.ok ? 200 : nestResponse.status });
}