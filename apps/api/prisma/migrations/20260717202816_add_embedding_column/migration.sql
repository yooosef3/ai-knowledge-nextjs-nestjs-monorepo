-- This is an empty migration.
ALTER TABLE "Chunk" ADD COLUMN "embedding" vector(768);

-- Index for fast approximate nearest-neighbor search
CREATE INDEX chunk_embedding_idx ON "Chunk"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);