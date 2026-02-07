import { getRedisClient } from './redis.client';

export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export async function setCache(
  key: string,
  value: any,
  ttlSeconds = 60,
) {
  const redis = getRedisClient();
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function delCache(key: string) {
  const redis = getRedisClient();
  await redis.del(key);
}
