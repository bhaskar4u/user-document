import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseError } from '../errors';
import { buildErrorResponse } from '../utils/error-response.util';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';

    // Our custom errors
    if (exception instanceof BaseError) {
      message = exception.message;
      code = exception.code;

      if ('statusCode' in exception) {
        status = (exception as any).statusCode;
      }
    }

    // Nest HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json(
      buildErrorResponse(
        message,
        code,
        request.url,
      ),
    );
  }
}
