export async function POST(req: Request) {
  const { question, token } = await req.json();

  const nestResponse = await fetch("http://localhost:3001/chat/ask-stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  if (!nestResponse.body) {
    return new Response("No stream from backend", { status: 502 });
  }

  return new Response(nestResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
