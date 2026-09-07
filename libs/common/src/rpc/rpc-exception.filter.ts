import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

import { Observable, throwError } from 'rxjs';
import { BaseError } from '../../errors';
import { RpcStatusMap } from './rpc-error.map';
import { RpcErrorPayload } from './rpc-error.payload';

@Catch()
export class GlobalRpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(GlobalRpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let status = 500;
console.log("Globallllllllllllll______________++++++++++++++++++++++++++++++++++");

    const payload: RpcErrorPayload = {
      code: 'INTERNAL_ERROR',
      message: 'Unhandled RPC exception',
      isOperational: false,
      details: null,
    };

    // -------------------------
    // 1. Domain / Business Errors
    // -------------------------
    if (exception instanceof BaseError) {
      payload.code = exception.code;
      payload.message = exception.message;
      payload.isOperational = exception.isOperational;
      payload.details = exception.details;

      status = RpcStatusMap[exception.code] ?? 500;
    }

    // -------------------------
    // 2. PostgreSQL Errors (VERY IMPORTANT)
    // -------------------------
    else if (exception?.code === '23505') {
      payload.code = 'DUPLICATE_RESOURCE';
      payload.message = 'Resource already exists';
      payload.isOperational = true;

      status = 409;
    }

    else if (exception?.code === '23503') {
      payload.code = 'FOREIGN_KEY_VIOLATION';
      payload.message = 'Invalid reference to related resource';
      payload.isOperational = true;

      status = 400;
    }

    // -------------------------
    // 3. Nest HttpException (edge case)
    // -------------------------
    else if (exception instanceof HttpException) {
      const res = exception.getResponse();

      payload.message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message;

      payload.code = 'HTTP_EXCEPTION';
      payload.isOperational = true;

      status = exception.getStatus();
    }

    // -------------------------
    // 4. Unknown Errors (fallback)
    // -------------------------
    else {
      payload.message = exception?.message || payload.message;
    }

    // -------------------------
    // 5. Logging (CRITICAL)
    // -------------------------
    this.logger.error(
      `RPC Error → code=${payload.code} status=${status}`,
      exception?.stack || exception,
    );

    // -------------------------
    // 6. Return standardized RPC exception
    // -------------------------
    return throwError(
      () =>
        new RpcException({
          status,
          ...payload,
        }),
    );
  }
}