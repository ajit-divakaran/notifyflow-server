import IORedis from 'ioredis';

// Configuration for Redis (Local or Upstash) [cite: 20]
export const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null 
});