// utils/redis.js
import { createClient } from 'redis';
const  REDIS_URL='redis://localhost:6379'

const client = createClient({
  url: process.env.REDIS_URL
});

export const ratelimit = async (key, maxRequests, windowSeconds) => {
  const current = await client.incr(key);
  if (current > maxRequests) {
    throw new Error('Rate limit exceeded');
  }
  if (current === 1) {
    await client.expire(key, windowSeconds);
  }
};