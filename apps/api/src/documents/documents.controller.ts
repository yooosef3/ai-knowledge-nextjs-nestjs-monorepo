import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DocumentsService } from './documents.service';
import { MulterFile } from './multer-file.type';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: MulterFile,
    @Body('workspaceId') workspaceId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.documentsService.uploadDocument(file, workspaceId, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: { workspaceId?: string }) {
    return this.documentsService.findAll(user.workspaceId!);
  }
}
