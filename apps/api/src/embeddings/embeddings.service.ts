import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const EMBEDDING_MODEL = 'nomic-embed-text';
const EXPECTED_DIMENSIONS = 768; // matches nomic-embed-text output and our pgvector column

@Injectable()
export class EmbeddingsService {
  private baseUrl: string;

  constructor(private config: ConfigService) {
    this.baseUrl = this.config.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434';
  }

  async embedText(text: string): Promise<number[]> {
    const response = await axios.post(`${this.baseUrl}/api/embeddings`, {
      model: EMBEDDING_MODEL,
      prompt: text,
    });

    const embedding = response.data?.embedding;
    if (!embedding || embedding.length !== EXPECTED_DIMENSIONS) {
      throw new Error(
        `Ollama returned an unexpected embedding shape (got ${embedding?.length ?? 0} dims, expected ${EXPECTED_DIMENSIONS})`,
      );
    }
    return embedding;
  }

  async embedTexts(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      embeddings.push(await this.embedText(text));
    }
    return embeddings;
  }
}