-- Re-add the document chunk embedding column after it was dropped by an earlier migration.
ALTER TABLE "Chunk"
ADD COLUMN IF NOT EXISTS "embedding" vector(768);

CREATE INDEX IF NOT EXISTS chunk_embedding_idx ON "Chunk"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
