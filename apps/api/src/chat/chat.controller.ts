import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RetrievalService } from './retrieval.service';
import { PromptService } from './prompt.service';
import { GenerationService } from './generation.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private retrievalService: RetrievalService,
    private promptService: PromptService,
    private generationService: GenerationService,
  ) {}

  @Post('retrieve')
  retrieve(
    @Body('question') question: string,
    @CurrentUser() user: { workspaceId?: string },
  ) {
    return this.retrievalService.retrieveRelevantChunks(
      question,
      user.workspaceId!,
    );
  }

  @Post('prompt-preview')
  async promptPreview(
    @Body('question') question: string,
    @CurrentUser() user: { workspaceId?: string },
  ) {
    const chunks = await this.retrievalService.retrieveRelevantChunks(
      question,
      user.workspaceId!,
    );
    return this.promptService.buildPrompt(question, chunks);
  }

  @Post('ask')
  async ask(
    @Body('question') question: string,
    @CurrentUser() user: { workspaceId?: string },
  ) {
    const chunks = await this.retrievalService.retrieveRelevantChunks(
      question,
      user.workspaceId!,
    );
    const prompt = this.promptService.buildPrompt(question, chunks);
    const answer = await this.generationService.generateAnswer(prompt);
    return {
      answer,
      sources: chunks.map((c) => ({
        documentId: c.documentId,
        similarity: c.similarity,
      })),
    };
  }

  @Post('ask-stream')
  async askStream(
    @Body('question') question: string,
    @CurrentUser() user: { workspaceId?: string },
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      const chunks = await this.retrievalService.retrieveRelevantChunks(
        question,
        user.workspaceId!,
      );
      const prompt = this.promptService.buildPrompt(question, chunks);

      await this.generationService.streamAnswer(prompt, (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      });

      res.write('data: [DONE]\n\n');
    } catch (err) {
      // Deliberately generic — same rule as every other error response in this app:
      // never leak internals, even mid-stream.
      res.write(
        `data: ${JSON.stringify({ error: 'Something went wrong generating a response' })}\n\n`,
      );
    } finally {
      res.end();
    }
  }
}
