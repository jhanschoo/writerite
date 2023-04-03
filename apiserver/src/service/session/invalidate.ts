import Redis from "ioredis";
import { ttlInSeconds } from "../userJWT";
import {
  SESSION_INVALIDATION_BY_ROOM_SLUG_TOPIC,
  SESSION_INVALIDATION_BY_USERID_TOPIC,
} from "./constants";

export function invalidateByUserId(
  redis: Redis,
  userId: string,
  currentTime?: number
) {
  return redis.set(
    `${SESSION_INVALIDATION_BY_USERID_TOPIC}${userId}`,
    currentTime ?? Math.floor(Date.now() / 1000),
    "EX",
    ttlInSeconds
  );
}

export function invalidateByRoomSlug(
  redis: Redis,
  slug: string,
  currentTime?: number
) {
  return redis.set(
    `${SESSION_INVALIDATION_BY_ROOM_SLUG_TOPIC}${slug}`,
    currentTime ?? Math.floor(Date.now() / 1000),
    "EX",
    ttlInSeconds
  );
}
