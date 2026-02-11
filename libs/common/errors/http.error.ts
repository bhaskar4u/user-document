import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error';

export class HttpError extends BaseError {
  public readonly statusCode: number;

  constructor(
    message: string,
    code: string,
    statusCode: HttpStatus,
    details?: unknown,
  ) {
    super(message, code, true, details);
    this.statusCode = statusCode;
  }
}
