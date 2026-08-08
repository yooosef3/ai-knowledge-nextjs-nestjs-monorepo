'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSession } from '@/hooks/useSession';
import { NestChatTransport } from '@/lib/nest-chat-transport';

export default function ChatPage() {
  const t = useTranslations('Chat');
  const theme = useTheme();
  const router = useRouter();
  const { data: user, isLoading: sessionLoading } = useSession();
  const [input, setInput] = useState('');
  const [transport] = useState(() => new NestChatTransport(() => ''));
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

  if (sessionLoading || !user) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: 420 }}>
      <Typography variant="h4" sx={{ mb: 2.5 }}>
        {t('title')}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.72)',
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 2.5 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 10, color: 'text.secondary', px: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'rgba(46, 111, 110, 0.1)',
                  display: 'grid',
                  placeItems: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 26, color: 'primary.main', opacity: 0.85 }} />
              </Box>
              <Typography sx={{ maxWidth: 320, mx: 'auto', lineHeight: 1.7 }}>{t('empty')}</Typography>
            </Box>
          )}

          {messages.map((m) => (
            <Box
              key={m.id}
              sx={{
                display: 'flex',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
                mb: 2,
              }}
            >
              {m.role === 'assistant' && (
                <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                  <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  px: 1.75,
                  py: 1.1,
                  maxWidth: '75%',
                  bgcolor: m.role === 'user' ? 'primary.main' : 'grey.100',
                  color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 3,
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
              <CircularProgress size={14} />
              <Typography variant="body2" color="text.secondary">
                {t('thinking')}
              </Typography>
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>

        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            placeholder={t('placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isBusy}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <IconButton
            type="submit"
            disabled={isBusy || !input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 40,
              height: 40,
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'grey.200', color: 'grey.400' },
            }}
          >
            <SendRoundedIcon
              fontSize="small"
              sx={{ transform: theme.direction === 'rtl' ? 'scaleX(-1)' : undefined }}
            />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
