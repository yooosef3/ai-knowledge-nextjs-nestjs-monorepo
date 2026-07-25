import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';

export interface RetrievedChunk {
  id: string;
  content: string;
  documentId: string;
  similarity: number;
}

const TOP_K = 5;

@Injectable()
export class RetrievalService {
  constructor(
    private prisma: PrismaService,
    private embeddings: EmbeddingsService,
  ) {}

  async retrieveRelevantChunks(
    question: string,
    workspaceId: string,
  ): Promise<RetrievedChunk[]> {
    const questionEmbedding = await this.embeddings.embedText(question);
    const questionEmbeddingLiteral = `[${questionEmbedding.join(',')}]`;

    return this.prisma.$queryRaw<RetrievedChunk[]>`
      SELECT c.id, c.content, c."documentId",
             1 - (c.embedding <=> ${questionEmbeddingLiteral}::vector) AS similarity
      FROM "Chunk" c
      JOIN "Document" d ON d.id = c."documentId"
      WHERE d."workspaceId" = ${workspaceId}
      ORDER BY c.embedding <=> ${questionEmbeddingLiteral}::vector
      LIMIT ${TOP_K}
    `;
  }
}
