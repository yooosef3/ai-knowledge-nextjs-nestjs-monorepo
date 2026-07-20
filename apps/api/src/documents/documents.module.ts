import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { TextExtractionService } from './text-extraction.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, CloudinaryProvider, TextExtractionService],
})
export class DocumentsModule {}
