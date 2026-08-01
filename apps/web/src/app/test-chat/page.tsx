"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";
import { NestChatTransport } from "../../lib/nest-chat-transport";

export default function ChatTestPage() {
  const [token, setToken] = useState("");
  const tokenRef = useRef("");
  tokenRef.current = token;

  const [input, setInput] = useState("");
  const [transport] = useState(
    () => new NestChatTransport(() => tokenRef.current),
  );
  const { messages, sendMessage, status } = useChat({ transport });

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <p style={{ fontSize: 12, color: "#888" }}>
        Temporary: paste a JWT from /auth/login. Real auth arrives in Lesson 20.
      </p>
      <input
        placeholder="Paste JWT token here"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", marginBottom: 16, padding: 8 }}
      />

      <div style={{ marginBottom: 16 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <strong>{m.role}:</strong>{" "}
            {m.parts.map((p, i) =>
              p.type === "text" ? <span key={i}>{p.text}</span> : null,
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ width: "80%", padding: 8 }}
        />
        <button
          type="submit"
          disabled={status === "streaming"}
          style={{ padding: 8 }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
