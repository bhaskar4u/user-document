import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { BaseError } from '../../errors';
import { RpcStatusMap } from './rpc-error.map';
import { RpcErrorPayload } from './rpc-error.payload';

@Catch()
export class GlobalRpcExceptionFilter
  implements RpcExceptionFilter
{
  catch(exception: unknown): Observable<any> {

    // ✅ Our domain/system errors
    if (exception instanceof BaseError) {
      const payload: RpcErrorPayload = {
        code: exception.code,
        message: exception.message,
        isOperational: exception.isOperational,
        details: exception.details,
      };

      const status =
        RpcStatusMap[exception.code] ?? 500;

      return throwError(
        () =>
          new RpcException({
            status,
            ...payload,
          }),
      );
    }

    // ❌ Unexpected / programmer error
    return throwError(
      () =>
        new RpcException({
          status: 500,
          code: 'INTERNAL_ERROR',
          message: 'Unhandled RPC exception',
        }),
    );
  }
}
