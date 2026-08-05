'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSession } from '@/hooks/useSession';
import { useDocuments } from '@/hooks/useDocuments';
import { useUploadDocument } from '@/hooks/useUploadDocument';

const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'txt']; // mirrors TextExtractionService (Lesson 9)

export default function DocumentsPage() {
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
        setFileError(`Unsupported file type: .${extension}. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`);
        return;
      }
      setFileError(null);
      upload.mutate(file);
    },
    [upload],
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

  if (sessionLoading || !user) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Documents</Typography>

      <Paper
        variant="outlined"
        component="label"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          p: 4, mb: 3, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer',
          borderColor: isDragging ? 'primary.main' : 'divider',
          bgcolor: isDragging ? 'action.hover' : 'transparent',
        }}
      >
        <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography>Drag a file here, or click to browse (PDF, DOCX, TXT)</Typography>
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

      {upload.isPending && <Alert severity="info" sx={{ mb: 2 }}>Uploading and processing…</Alert>}
      {fileError && <Alert severity="warning" sx={{ mb: 2 }}>{fileError}</Alert>}
      {upload.isError && <Alert severity="error" sx={{ mb: 2 }}>{upload.error.message}</Alert>}

      {docsLoading && <CircularProgress size={24} />}
      {docsError && <Alert severity="error">{docsError.message}</Alert>}

      <List>
        {documents?.map((doc) => (
          <ListItem key={doc.id} divider>
            <ListItemText primary={doc.title} secondary={new Date(doc.createdAt).toLocaleString()} />
          </ListItem>
        ))}
        {documents?.length === 0 && (
          <Typography color="text.secondary">No documents yet — upload one above.</Typography>
        )}
      </List>
    </Box>
  );
}