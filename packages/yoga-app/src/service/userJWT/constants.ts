import { importJWK } from 'jose';

import env from '../../safeEnv';

/**
 * These exports are intended to be package-internal.
 */
export const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = env;

export const alg = 'ES256';
export const issuer = 'writerite.site';

export const PRIVATE_KEY_P = importJWK(JWT_PRIVATE_KEY, alg);
export const PUBLIC_KEY_P = importJWK(JWT_PUBLIC_KEY, alg);

export const ttlInSeconds =
  process.env.NODE_ENV === 'production'
    ? // 1 week
      60 * 60 * 24 * 7
    : 60;
