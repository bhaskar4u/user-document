import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter
  implements ExceptionFilter
{
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception.getError() as any;

    const status = error?.status ?? 500;

    response.status(status).json({
      success: false,
      code: error?.code ?? 'INTERNAL_ERROR',
      message: error?.message ?? 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}
