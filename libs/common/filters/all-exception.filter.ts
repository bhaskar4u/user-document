import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseError } from '../errors';
import { buildErrorResponse } from '../utils/error-response.util';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';

    // ✅ 1. Custom Errors
    if (exception instanceof BaseError) {
      message = exception.message;
      code = exception.code;
      status = exception['statusCode'] || status;
    }

    // ✅ 2. PostgreSQL Errors
    else if (exception?.code === '23505') {
      status = HttpStatus.CONFLICT;
      message = 'Resource already exists';
      code = 'DUPLICATE_RESOURCE';
    }

    // ✅ 3. NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message;
    }

    // ✅ 4. Log EVERYTHING (very important)
    this.logger.error(
      `[${request.method}] ${request.url}`,
      exception.stack || exception,
    );

    response.status(status).json(
      buildErrorResponse(message, code, request.url),
    );
  }
}