import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
