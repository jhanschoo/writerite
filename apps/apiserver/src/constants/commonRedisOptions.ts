import env from '../safeEnv';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

export const commonRedisOptions = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
  retryStrategy: (times: number): number => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  password: REDIS_PASSWORD || undefined,
};
