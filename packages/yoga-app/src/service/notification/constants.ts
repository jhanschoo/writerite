import { WRITERITE_TOPIC } from '../redis';

export const NOTIFICATION_UPDATES_BY_USERID_TOPIC =
  `${WRITERITE_TOPIC}notificationu:userid:` as const;
