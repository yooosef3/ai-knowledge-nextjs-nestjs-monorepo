import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, CloudinaryProvider],
})
export class DocumentsModule {}
