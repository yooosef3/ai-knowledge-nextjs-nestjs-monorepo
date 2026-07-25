import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

@Injectable()
export class TextExtractionService {
  async extractText(
    fileUrl: string,
    originalFilename: string,
  ): Promise<string> {
    const buffer = await this.downloadWithRetry(fileUrl);

    const extension = originalFilename.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return this.extractFromPdf(buffer);
      case 'docx':
        return this.extractFromDocx(buffer);
      case 'txt':
        return buffer.toString('utf-8');
      default:
        throw new BadRequestException(
          `Unsupported file type: .${extension}. Supported: pdf, docx, txt`,
        );
    }
  }

  private async downloadWithRetry(url: string, attempts = 3): Promise<Buffer> {
    for (let i = 1; i <= attempts; i++) {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          timeout: 15000,
        });
        return Buffer.from(response.data);
      } catch (err) {
        if (i === attempts) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1000 * i)); // backoff: 1s, 2s
      }
    }
    throw new Error('Unreachable'); // TypeScript needs this; loop always returns or throws
  }

  private async extractFromPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  private async extractFromDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
}
