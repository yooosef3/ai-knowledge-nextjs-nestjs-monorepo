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
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

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

  private async extractFromPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy(); // releases internal resources — new in v2
    }
  }

  private async extractFromDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
}
