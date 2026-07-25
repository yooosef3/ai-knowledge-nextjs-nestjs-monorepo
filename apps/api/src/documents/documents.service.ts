import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadApiResponse, v2 as CloudinaryClient } from 'cloudinary';
import * as streamifier from 'streamifier';
import { MulterFile } from './multer-file.type';
import { TextExtractionService } from './text-extraction.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private textExtraction: TextExtractionService,
    private chunking: ChunkingService,
    private embeddings: EmbeddingsService,
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

    const extractedText = await this.textExtraction.extractText(
      uploadResult.secure_url,
      file.originalname,
    );

    const textChunks = this.chunking.chunkText(extractedText);
    const chunkEmbeddings = await this.embeddings.embedTexts(textChunks);

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = await this.prisma.chunk.create({
        data: { content: textChunks[i], documentId: document.id },
      });

      const embeddingLiteral = `[${chunkEmbeddings[i].join(',')}]`;
      await this.prisma.$executeRawUnsafe(
        'UPDATE "Chunk" SET embedding = $1::vector WHERE id = $2',
        embeddingLiteral,
        chunk.id,
      );
    }

    return { ...document, chunkCount: textChunks.length };
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
