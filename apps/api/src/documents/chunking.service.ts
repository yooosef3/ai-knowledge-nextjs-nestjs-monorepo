import { Injectable } from '@nestjs/common';

const CHUNK_SIZE_WORDS = 200;
const CHUNK_OVERLAP_WORDS = 40;

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
      start = end - CHUNK_OVERLAP_WORDS; // step back so chunks overlap
    }

    return chunks;
  }
}
