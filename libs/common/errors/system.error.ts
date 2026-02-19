import { BaseError } from './base.error';
export class SystemError extends BaseError {
  constructor(message: string, code: string, details?: unknown) {
    super(message, code, 500, false, details);
  }
}
