import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadApiResponse, v2 as CloudinaryClient } from 'cloudinary';
import * as streamifier from 'streamifier';
import { MulterFile } from './multer-file.type';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    @Inject('CLOUDINARY') private cloudinary: typeof CloudinaryClient,
  ) {}

  async uploadDocument(file: MulterFile, workspaceId: string, userId: string) {
    // Verify the user actually belongs to this workspace before touching storage
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId, workspaceId },
    });
    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    const uploadResult = await this.uploadToCloudinary(file);

    return this.prisma.document.create({
      data: {
        title: file.originalname,
        fileUrl: uploadResult.secure_url,
        workspaceId,
        uploadedById: userId,
      },
    });
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
