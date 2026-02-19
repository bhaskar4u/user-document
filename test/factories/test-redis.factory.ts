import Redis from 'ioredis';

export function createTestRedis() {
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    lazyConnect: true, // ⚠ prevents auto connect
  });
}
