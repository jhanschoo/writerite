import { WRITERITE_TOPIC } from "../redis";

export const MESSAGE_UPDATES_BY_ROOM_SLUG_TOPIC =
  `${WRITERITE_TOPIC}messageu:roomslug:` as const;
