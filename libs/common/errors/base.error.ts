export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  protected constructor(
    message: string,
    code: string,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
  }
}
