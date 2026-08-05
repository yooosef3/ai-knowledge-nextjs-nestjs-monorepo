'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useSession } from '@/hooks/useSession';
import { NestChatTransport } from '@/lib/nest-chat-transport';

export default function ChatPage() {
  const router = useRouter();
  const { data: user, isLoading: sessionLoading } = useSession();
  const [input, setInput] = useState('');
  const [transport] = useState(() => new NestChatTransport());
  const { messages, sendMessage, status } = useChat({ transport });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionLoading && !user) router.push('/login');
  }, [sessionLoading, user, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isBusy = status === 'submitted' || status === 'streaming';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage({ text: input });
    setInput('');
  };

  if (sessionLoading || !user) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Chat</Typography>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, px: 1 }}>
        {messages.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Ask a question about your uploaded documents.
          </Typography>
        )}

        {messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              display: 'flex',
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1,
              mb: 2,
            }}
          >
            {m.role === 'assistant' && (
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
            )}
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                maxWidth: '75%',
                bgcolor: m.role === 'user' ? 'primary.main' : 'background.paper',
                color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
              }}
            >
              {m.parts.map((p, i) =>
                p.type === 'text' ? (
                  <Typography key={i} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {p.text}
                  </Typography>
                ) : null,
              )}
            </Paper>
          </Box>
        ))}

        {status === 'submitted' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 5 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">Thinking…</Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isBusy}
          size="small"
        />
        <IconButton type="submit" color="primary" disabled={isBusy || !input.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}