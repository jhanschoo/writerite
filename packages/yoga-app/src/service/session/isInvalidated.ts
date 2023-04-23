import Redis from 'ioredis';
import { JWTPayload } from 'jose';

import { CurrentUser } from '../userJWT';
import {
  getInvalidationByRoomIdTopic,
  getInvalidationByUserIdTopic,
} from './util';

export interface InvalidatedGuardParams {
  redis: Redis;
  payload: JWTPayload;
  sub: CurrentUser;
}

// TODO: invalidation checking should also consider tokens issued by other redis instances invalidated.
export async function isInvalidated(params: InvalidatedGuardParams) {
  const {
    redis,
    payload: { iat },
    sub: { bareId, occupyingRoomSlugs },
  } = params;
  const timestamps = await redis.mget(
    getInvalidationByUserIdTopic(bareId),
    ...Object.keys(occupyingRoomSlugs).map(getInvalidationByRoomIdTopic)
  );
  if (!iat) {
    return true;
  }
  // Note: consistency assumption: there have been no tokens issued in the last 1 second and there is no drift.
  return timestamps.some((timestamp) => timestamp && iat < Number(timestamp));
}
