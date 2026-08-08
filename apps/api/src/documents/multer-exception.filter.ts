import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const message =
      exception.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 10MB.'
        : 'File upload error.';
    response.status(400).json({ statusCode: 400, message, error: 'Bad Request' });
  }
}