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
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSession } from '@/hooks/useSession';
import { NestChatTransport } from '@/lib/nest-chat-transport';

export default function ChatPage() {
  const router = useRouter();
  const { data: user, isLoading: sessionLoading } = useSession();
  const [input, setInput] = useState('');
  const [transport] = useState(() => new NestChatTransport());
  const { messages, sendMessage, status } = useChat({ transport });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!sessionLoading && !user) router.push('/login'); }, [sessionLoading, user, router]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
      <Typography variant="h4" sx={{ mb: 2 }}>Chat</Typography>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, px: 0.5 }}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
            <AutoAwesomeIcon sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
            <Typography>Ask a question about your uploaded documents.</Typography>
          </Box>
        )}

        {messages.map((m) => (
          <Box key={m.id} sx={{
            display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-end', gap: 1, mb: 2,
          }}>
            {m.role === 'assistant' && (
              <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
              </Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 1.75, maxWidth: '75%',
                bgcolor: m.role === 'user' ? 'primary.main' : 'grey.100',
                color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 3,
                borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                borderBottomLeftRadius: m.role === 'user' ? 12 : 4,
              }}
            >
              {m.parts.map((p, i) => p.type === 'text' ? (
                <Typography key={i} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{p.text}</Typography>
              ) : null)}
            </Paper>
          </Box>
        ))}

        {status === 'submitted' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 5 }}>
            <CircularProgress size={14} />
            <Typography variant="body2" color="text.secondary">Thinking…</Typography>
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth placeholder="Ask a question..." value={input}
          onChange={(e) => setInput(e.target.value)} disabled={isBusy} size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 6, bgcolor: 'background.paper' } }}
        />
        <IconButton type="submit" disabled={isBusy || !input.trim()}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'grey.200' } }}>
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}