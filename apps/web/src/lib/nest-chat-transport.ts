import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";

export class NestChatTransport implements ChatTransport<UIMessage> {
  constructor(private getToken: () => string) {}

 async sendMessages({ messages }: { messages: UIMessage[] }): Promise<ReadableStream<UIMessageChunk>> {
  const lastMessage = messages[messages.length - 1];
  const question = lastMessage.parts.find((p) => p.type === 'text')?.text ?? '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }), 
  });

    if (!response.body) throw new Error("No response body from /api/chat");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const messageId = crypto.randomUUID();

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        controller.enqueue({ type: "start", messageId } as UIMessageChunk);
        controller.enqueue({
          type: "text-start",
          id: messageId,
        } as UIMessageChunk);

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                controller.enqueue({
                  type: "text-delta",
                  id: messageId,
                  delta: parsed.token,
                } as UIMessageChunk);
              }
            } catch {
              // incomplete fragment split across reads — safe to skip
            }
          }
        }

        controller.enqueue({
          type: "text-end",
          id: messageId,
        } as UIMessageChunk);
        controller.enqueue({ type: "finish" } as UIMessageChunk);
        controller.close();
      },
    });
  }

  async reconnectToStream() {
    return null; // no persistent server-side stream to reconnect to, same as DirectChatTransport
  }
}
