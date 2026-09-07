import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../redis/redis.client';
import { BusinessError, ErrorCode, SystemError } from '@app/common';

const redisClient = getRedisClient();

/**
 * Global limiter (system protection)
 */
const globalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_global',
  points: Number(process.env.GLOBAL_RATE_POINTS ?? 50),
  duration: Number(process.env.GLOBAL_RATE_DURATION ?? 300),
});

/**
 * Per-user limiter (fair usage)
 */
const userLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_user',
  points: Number(process.env.USER_RATE_POINTS ?? 5),
  duration: Number(process.env.USER_RATE_DURATION ?? 60),
  blockDuration: Number(process.env.USER_BLOCK_DURATION ?? 300), // 🔥 important
});

/**
 * Unified rate limit checker
 */
export async function enforceRateLimit(
  key: string,
) {
  try {
    await globalLimiter.consume('global');
    await userLimiter.consume(key);
  } catch (err: any) {
    const retryAfter = Math.ceil(err?.msBeforeNext / 1000) || 1;
    if (typeof err?.msBeforeNext === 'number') {
    throw new BusinessError(
      `Too many requests. Try again in ${retryAfter}s`,
      ErrorCode.TOO_MANY_REQUESTS,
      retryAfter,
      429
    );
  }
   // Redis / infrastructure failure
    console.error('🔥 RATE LIMITER ERROR:', err);

    throw new SystemError(
      'Rate limiter unavailable',
      ErrorCode.REDIS_ERROR,
      503
    );
  }
}