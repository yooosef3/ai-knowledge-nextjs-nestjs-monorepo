import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatPrompt } from './prompt.service';

const CHAT_MODEL = 'llama3.2';
/** Cold model loads + long answers often exceed 60s on local Ollama. */
const GENERATE_TIMEOUT_MS = 180_000;
/** Streaming must not die mid-response; 0 disables axios request timeout. */
const STREAM_TIMEOUT_MS = 0;

@Injectable()
export class GenerationService {
  private baseUrl: string;

  constructor(private config: ConfigService) {
    this.baseUrl =
      this.config.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434';
  }

  async generateAnswer(prompt: ChatPrompt): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/api/chat`,
      {
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: prompt.systemPrompt },
          { role: 'user', content: prompt.userPrompt },
        ],
        stream: false,
      },
      { timeout: GENERATE_TIMEOUT_MS },
    );

    const answer = response.data?.message?.content;
    if (!answer) {
      throw new Error('Ollama returned no answer content');
    }
    return answer;
  }

  async streamAnswer(
    prompt: ChatPrompt,
    onToken: (token: string) => void,
  ): Promise<void> {
    const response = await axios.post(
      `${this.baseUrl}/api/chat`,
      {
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: prompt.systemPrompt },
          { role: 'user', content: prompt.userPrompt },
        ],
        stream: true,
      },
      { responseType: 'stream', timeout: STREAM_TIMEOUT_MS },
    );

    return new Promise((resolve, reject) => {
      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // last line may be incomplete — keep it for next chunk

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              onToken(parsed.message.content);
            }
            if (parsed.error) {
              reject(new Error(String(parsed.error)));
            }
          } catch {
            // an incomplete JSON fragment split across chunks — safe to skip
          }
        }
      });

      response.data.on('end', () => resolve());
      response.data.on('error', (err: Error) => reject(err));
    });
  }
}
