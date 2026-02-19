import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error';

export class HttpError extends BaseError {

  constructor(
    message: string,
    code: string,
    statusCode: HttpStatus,
    details?: unknown,
  ) {
    super(message, code, statusCode, true, details);
  }
}
