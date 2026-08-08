import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, UseFilters, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DocumentsService } from './documents.service';
import { MulterFile } from './multer-file.type';
import { Throttle } from '@nestjs/throttler';
import { MulterExceptionFilter } from './multer-exception.filter';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt']; // mirrors TextExtractionService

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 uploads/min — resource consumption guard
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, callback) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
          return callback(new BadRequestException(`Unsupported file type: .${ext}`), false);
        }
        callback(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: MulterFile, @CurrentUser() user: { userId: string; workspaceId?: string }) {
    return this.documentsService.uploadDocument(file, user.workspaceId!, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: { workspaceId?: string }) {
    return this.documentsService.findAll(user.workspaceId!);
  }
}