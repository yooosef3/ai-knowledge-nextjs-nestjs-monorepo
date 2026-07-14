import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  findAll(): string {
    return 'Hello World!';
  }
}
