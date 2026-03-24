import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../redis/redis.client';

const redisClient = getRedisClient();

/**
 * Global limiter (Protects system)
 */
const globalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'worker_global',
  points: Number(process.env.GLOBAL_RATE_POINTS || 50),
  duration: Number(process.env.GLOBAL_RATE_DURATION || 1),
});

/**
 * Per-user limiter (Fair usage)
 */
const userLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'worker_user',
  points: Number(process.env.USER_RATE_POINTS || 5),
  duration: Number(process.env.USER_RATE_DURATION || 1),
});

export async function checkRateLimit(
  userId: number,
): Promise<boolean> {
  try {
    await globalLimiter.consume('global');
    await userLimiter.consume(`user_${userId}`);
    return true;
  } catch {
    return false;
  }
}