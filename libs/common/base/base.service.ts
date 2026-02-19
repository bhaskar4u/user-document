import { Logger } from '@nestjs/common';
import { SystemError, ErrorCode } from '../errors';

export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  protected handleSystemError(error: unknown, message: string): never {
    this.logger.error(
    message,
    error instanceof Error ? error.stack : undefined,
  );

    throw new SystemError(
      message,
      ErrorCode.INTERNAL_ERROR,
      error,
    );
  }
}
