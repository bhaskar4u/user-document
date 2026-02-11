import { BaseError } from './base.error';

export class BusinessError extends BaseError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, true, details);
  }
}
