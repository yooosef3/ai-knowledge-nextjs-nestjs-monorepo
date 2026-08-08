'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useSession } from '@/hooks/useSession';
import { useDocuments } from '@/hooks/useDocuments';
import { useUploadDocument } from '@/hooks/useUploadDocument';

const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'txt'];

function FileIcon({ title }: { title: string }) {
  const ext = title.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <PictureAsPdfOutlinedIcon sx={{ color: '#D64545' }} />;
  if (ext === 'docx') return <ArticleOutlinedIcon sx={{ color: '#2E6F6E' }} />;
  if (ext === 'txt') return <DescriptionOutlinedIcon sx={{ color: '#3D5A80' }} />;
  return <InsertDriveFileOutlinedIcon />;
}

export default function DocumentsPage() {
  const t = useTranslations('Documents');
  const router = useRouter();
  const { data: user, isLoading: sessionLoading } = useSession();
  const { data: documents, isLoading: docsLoading, error: docsError } = useDocuments();
  const upload = useUploadDocument();
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !user) router.push('/login');
  }, [sessionLoading, user, router]);

  const validateAndUpload = useCallback(
    (file: File) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
        setFileError(
          t('unsupportedType', {
            extension: extension || '?',
            accepted: ACCEPTED_EXTENSIONS.join(', '),
          }),
        );
        return;
      }
      setFileError(null);
      upload.mutate(file);
    },
    [upload, t],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload],
  );

  if (sessionLoading || !user) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('title')}
      </Typography>

      <Paper
        variant="outlined"
        component="label"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          p: { xs: 4, sm: 5 },
          mb: 3,
          textAlign: 'center',
          borderStyle: 'dashed',
          borderWidth: 2,
          cursor: 'pointer',
          borderRadius: 3,
          borderColor: isDragging ? 'primary.main' : 'divider',
          bgcolor: isDragging ? 'rgba(46, 111, 110, 0.06)' : 'rgba(255,255,255,0.55)',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.light',
            bgcolor: 'rgba(46, 111, 110, 0.04)',
          },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: 'rgba(46, 111, 110, 0.1)',
            display: 'grid',
            placeItems: 'center',
            mx: 'auto',
            mb: 1.5,
          }}
        >
          <UploadFileIcon sx={{ fontSize: 26, color: 'primary.main' }} />
        </Box>
        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{t('dropTitle')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('dropHint')}
        </Typography>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndUpload(file);
            e.target.value = '';
          }}
        />
      </Paper>

      {upload.isPending && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('uploading')}
        </Alert>
      )}
      {fileError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {fileError}
        </Alert>
      )}
      {upload.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {upload.error.message}
        </Alert>
      )}
      {docsLoading && <CircularProgress size={24} />}
      {docsError && <Alert severity="error">{docsError.message}</Alert>}

      {documents?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.35 }} />
          <Typography>{t('empty')}</Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {documents?.map((doc) => (
          <Grid key={doc.id} size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined">
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2, '&:last-child': { pb: 2 } }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'rgba(26, 36, 33, 0.04)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileIcon title={doc.title} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 600 }}>
                    {doc.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(doc.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
