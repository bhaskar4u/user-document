import { BaseError } from './base.error';
export class BusinessError extends BaseError {
  constructor(message: string, code: string, statusCode = 400, details?: unknown) {
    super(message, code, statusCode, true, details);
  }
}
