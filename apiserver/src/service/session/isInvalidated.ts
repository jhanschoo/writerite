import Redis from 'ioredis';
import { JWTPayload } from 'jose';
import { CurrentUser } from '../userJWT';
import { getInvalidationByRoomSlugTopic, getInvalidationByUserIdTopic } from './util';

export interface InvalidatedGuardParams {
  redis: Redis;
  payload: JWTPayload;
  sub: CurrentUser;
}

export async function isInvalidated(params: InvalidatedGuardParams) {
  const {
    redis,
    payload: { iat },
    sub: { id, occupyingActiveRoomSlugs },
  } = params;
  const timestamps = await redis.mget(
    getInvalidationByUserIdTopic(id),
    ...(occupyingActiveRoomSlugs ?? []).map(getInvalidationByRoomSlugTopic)
  );
  if (!iat) {
    return true;
  }
  // Note: consistency assumption: there have been no tokens issued in the last 1 second and there is no drift.
  return timestamps.some((timestamp) => timestamp && iat < Number(timestamp));
}
