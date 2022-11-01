import { SESSION_INVALIDATION_BY_ROOM_SLUG_TOPIC, SESSION_INVALIDATION_BY_USERID_TOPIC } from "./constants";

export function getInvalidationByUserIdTopic(userId: string) {
  return `${SESSION_INVALIDATION_BY_USERID_TOPIC}${userId}`;
}

export function getInvalidationByRoomSlugTopic(roomSlug: string) {
  return `${SESSION_INVALIDATION_BY_ROOM_SLUG_TOPIC}${roomSlug}`;
}
