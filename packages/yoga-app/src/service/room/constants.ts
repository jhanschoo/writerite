import { WRITERITE_TOPIC } from '../redis';

export const ROOM_UPDATES_BY_ROOMID_TOPIC =
  `${WRITERITE_TOPIC}roomu:id:` as const;
