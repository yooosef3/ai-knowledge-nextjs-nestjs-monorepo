import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { question } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const nestResponse = await fetch('http://localhost:3001/chat/ask-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ question }),
  });

  if (!nestResponse.body) {
    return new Response('No stream from backend', { status: 502 });
  }

  return new Response(nestResponse.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}