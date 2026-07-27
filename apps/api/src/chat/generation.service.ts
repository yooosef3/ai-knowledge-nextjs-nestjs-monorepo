import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatPrompt } from './prompt.service';

const CHAT_MODEL = 'llama3.2';

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
        stream: false, // non-streaming for now — Lessons 15–16 add real streaming
      },
      { timeout: 60000 },
    );

    const answer = response.data?.message?.content;
    if (!answer) {
      throw new Error('Ollama returned no answer content');
    }
    return answer;
  }
}
