import { ErrorCode } from '../../errors';

export const RpcStatusMap: Record<string, number> = {
  // Auth
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 401,
  [ErrorCode.AUTH_UNAUTHORIZED]: 401,

  // User
  [ErrorCode.USER_ALREADY_EXISTS]: 409,
  [ErrorCode.USER_NOT_FOUND]: 404,

  // Document
  [ErrorCode.DOCUMENT_NOT_FOUND]: 404,
  [ErrorCode.DOCUMENT_ACCESS_DENIED]: 403,

  // System
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.REDIS_ERROR]: 500,
  [ErrorCode.RABBITMQ_ERROR]: 500,
  [ErrorCode.INTERNAL_ERROR]: 500,
};
