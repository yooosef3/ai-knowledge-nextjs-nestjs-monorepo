'use client';

import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { useUploadDocument } from '@/hooks/useUploadDocument';

export default function DocumentsTestPage() {
  const [token, setToken] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');

  const { data: documents, isLoading, error } = useDocuments(token);
  const uploadMutation = useUploadDocument(token, workspaceId);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <p style={{ fontSize: 12, color: '#888' }}>
        Temporary: paste a JWT + workspaceId. Real auth arrives in Lesson 20.
      </p>
      <input placeholder="JWT token" value={token} onChange={(e) => setToken(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Workspace ID" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />

      <input
        type="file"
        disabled={uploadMutation.isPending}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadMutation.mutate(file);
        }}
      />
      {uploadMutation.isPending && <p>Uploading…</p>}
      {uploadMutation.isError && <p style={{ color: 'red' }}>{uploadMutation.error.message}</p>}

      <h3>Documents</h3>
      {isLoading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <ul>
        {documents?.map((doc) => (
          <li key={doc.id}>
            {doc.title} — {new Date(doc.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}