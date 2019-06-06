import Redis from 'ioredis';

import './assertConfig';

const { REDIS_HOST, REDIS_PORT } = process.env;
const redisOptions = {
  host: REDIS_HOST || '127.0.0.1',
  port: (REDIS_PORT) ? parseInt(REDIS_PORT , 10) : 6379,
  db: 1,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

export const createClient = () => new Redis(redisOptions);
