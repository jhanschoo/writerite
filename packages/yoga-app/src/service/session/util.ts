import {
  SESSION_INVALIDATION_BY_ROOMID_TOPIC,
  SESSION_INVALIDATION_BY_USERID_TOPIC,
} from './constants';

export function getInvalidationByUserIdTopic(userId: string) {
  return `${SESSION_INVALIDATION_BY_USERID_TOPIC}${userId}`;
}

export function getInvalidationByRoomIdTopic(roomId: string) {
  return `${SESSION_INVALIDATION_BY_ROOMID_TOPIC}${roomId}`;
}
