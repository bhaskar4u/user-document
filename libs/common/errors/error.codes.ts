export enum ErrorCode {
  // =====================================================
  // AUTHENTICATION & AUTHORIZATION
  // =====================================================

  // Invalid username/password combination
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',

  // Missing / invalid / expired token
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',


  // =====================================================
  // USER DOMAIN
  // =====================================================

  // User does not exist in system
  USER_NOT_FOUND = 'USER_NOT_FOUND',

  // Attempt to create user with existing email/username
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',


  // =====================================================
  // DOCUMENT DOMAIN
  // =====================================================

  // Requested document not found
  DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',

  // User trying to access document without permission
  DOCUMENT_ACCESS_DENIED = 'DOCUMENT_ACCESS_DENIED',


  // =====================================================
  // INGESTION / ASYNC PROCESSING (RabbitMQ Driven)
  // =====================================================

  // Failed to publish event to RabbitMQ
  RABBITMQ_PUBLISH_FAILED = 'RABBITMQ_PUBLISH_FAILED',

  // RabbitMQ connection/channel error
  RABBITMQ_CONNECTION_ERROR = 'RABBITMQ_CONNECTION_ERROR',

  // Consumer processing failure (message handling error)
  RABBITMQ_CONSUME_ERROR = 'RABBITMQ_CONSUME_ERROR',


  // =====================================================
  // INFRASTRUCTURE
  // =====================================================

  // Database query or transaction failure
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Redis caching failure (non-critical, degradable)
  REDIS_ERROR = 'REDIS_ERROR',


  // =====================================================
  // SYSTEM (Fallback / Unexpected)
  // =====================================================

  // Unhandled or unknown internal error
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}