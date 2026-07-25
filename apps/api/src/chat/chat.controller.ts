import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RetrievalService } from './retrieval.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private retrievalService: RetrievalService) {}

  @Post('retrieve')
  retrieve(
    @Body('question') question: string,
    @CurrentUser() user: { workspaceId?: string },
  ) {
    return this.retrievalService.retrieveRelevantChunks(question, user.workspaceId!);
  }
}