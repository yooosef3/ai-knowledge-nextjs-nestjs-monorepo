import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { TextExtractionService } from './text-extraction.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [EmbeddingsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, CloudinaryProvider, TextExtractionService, ChunkingService],
})
export class DocumentsModule {}