export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  protected constructor(
    message: string,
    code: string,
    statusCode: number,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}