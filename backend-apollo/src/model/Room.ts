import type { JsonObject, PrismaClient, Room } from "@prisma/client";
import type { UserSS } from "./User";
import type { ChatMsgSS } from "./ChatMsg";

export interface RoomConfigInput {
  deckId?: string | null;
  deckName?: string | null;
  roundLength?: number | null;
  clientDone?: boolean | null;
}

export interface RoomConfig {
  deckId?: string;
  deckName?: string;
  deckNameLang?: string;
  roundLength?: number;
  clientDone?: boolean;
}

// RoomStoredScalars
export interface RoomSS extends Partial<Room> {
  id: string;
  ownerId: string;
  archived: boolean;
  config: RoomConfig & JsonObject;

  owner?: UserSS | null;
  occupants?: (UserSS | null)[] | null;
  chatMsgs?: (ChatMsgSS | null)[] | null;

  // computed values
  inactive?: boolean;
}

export function roomTopic(id: string): string {
  return `room::${id}`;
}

export async function userOwnsRoom({ prisma, userId, roomId }: {
  prisma: PrismaClient;
  userId?: string | null;
  roomId?: string | null;
}): Promise<boolean> {
  if (!userId || !roomId) {
    return false;
  }
  return await prisma.room.count({
    where: {
      id: roomId,
      ownerId: userId,
    },
  }) === 1;
}

export async function userOccupiesRoom({ prisma, userId, roomId }: {
  prisma: PrismaClient;
  userId?: string | null;
  roomId?: string | null;
}): Promise<boolean> {
  if (!userId || !roomId) {
    return false;
  }
  return await prisma.room.count({
    where: {
      id: roomId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      occupants: { some: { B: userId } },
    },
  }) === 1;
}

export function roomToSS(room: Room): RoomSS;
export function roomToSS(room: Room | null): RoomSS | null;
export function roomToSS(room: Room | null): RoomSS | null {
  if (room === null) {
    return null;
  }
  const { config } = room;
  return {
    ...room,
    config: config as RoomConfig & JsonObject,
  };
}
