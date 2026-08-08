import { Injectable, BadRequestException } from '@nestjs/common';

const CHUNK_SIZE_WORDS = 200;
const CHUNK_OVERLAP_WORDS = 40;
const MAX_CHUNKS_PER_DOCUMENT = 50;

@Injectable()
export class ChunkingService {
  chunkText(text: string): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const chunks: string[] = [];
    let start = 0;

    while (start < words.length) {
      const end = Math.min(start + CHUNK_SIZE_WORDS, words.length);
      chunks.push(words.slice(start, end).join(' '));
      if (end === words.length) break;
      start = end - CHUNK_OVERLAP_WORDS;
    }

    if (chunks.length > MAX_CHUNKS_PER_DOCUMENT) {
      throw new BadRequestException(
        `Document produced ${chunks.length} chunks, exceeding the limit of ${MAX_CHUNKS_PER_DOCUMENT}. Please upload a smaller document.`,
      );
    }

    return chunks;
  }
}