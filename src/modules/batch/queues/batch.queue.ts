import Queue from 'bull';
import { redis } from '../../../config/redis';

export const batchQueue = new Queue('batch-queue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});