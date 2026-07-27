import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RetrievalService } from './retrieval.service';
import { PromptService } from './prompt.service';
import { GenerationService } from './generation.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [EmbeddingsModule],
  controllers: [ChatController],
  providers: [ChatService, RetrievalService, PromptService, GenerationService],
})
export class ChatModule {}
