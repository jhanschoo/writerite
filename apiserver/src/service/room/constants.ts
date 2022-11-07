import { RoomState } from '@prisma/client';
import { WRITERITE_TOPIC } from '../redis';

export const WillNotServeRoomStates: RoomState[] = [RoomState.SERVED];

export const ROOM_UPDATES_BY_ROOM_SLUG_TOPIC = `${WRITERITE_TOPIC}roomu:slug:` as const;
