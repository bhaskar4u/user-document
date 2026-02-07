import { getRedisClient } from './redis.client';

export async function checkRedisHealth() {
  const redis = getRedisClient();
  const result = await redis.ping();
  if (result !== 'PONG') {
    throw new Error('Redis not healthy');
  }
}
