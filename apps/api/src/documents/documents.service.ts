import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadApiResponse, v2 as CloudinaryClient } from 'cloudinary';
import * as streamifier from 'streamifier';
import { MulterFile } from './multer-file.type';
import { TextExtractionService } from './text-extraction.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private textExtraction: TextExtractionService,
    @Inject('CLOUDINARY') private cloudinary: typeof CloudinaryClient,
  ) {}

  async uploadDocument(file: MulterFile, workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId, workspaceId },
    });
    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    const uploadResult = await this.uploadToCloudinary(file);

    const document = await this.prisma.document.create({
      data: {
        title: file.originalname,
        fileUrl: uploadResult.secure_url,
        workspaceId,
        uploadedById: userId,
      },
    });

    // Extract text right away — Lesson 10 will chunk + embed it
    const extractedText = await this.textExtraction.extractText(
      uploadResult.secure_url,
      file.originalname,
    );

    return { ...document, extractedTextPreview: extractedText.slice(0, 200) };
  }

  private uploadToCloudinary(file: MulterFile): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'ai-knowledge-base' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  findAll(workspaceId: string) {
    return this.prisma.document.findMany({ where: { workspaceId } });
  }
}
