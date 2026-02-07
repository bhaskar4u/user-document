import { Redis } from 'ioredis';

let redis: Redis;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });
  }
  return redis;
}
