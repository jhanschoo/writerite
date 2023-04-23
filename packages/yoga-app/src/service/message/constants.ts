import { WRITERITE_TOPIC } from '../redis';

export const MESSAGE_UPDATES_BY_ROOMID_TOPIC =
  `${WRITERITE_TOPIC}messageu:roomid:` as const;
