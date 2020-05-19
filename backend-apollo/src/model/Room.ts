import { PrismaClient, Room } from "@prisma/client";
import { UserSS } from "./User";
import { ChatMsgSS } from "./ChatMsg";

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
  config: RoomConfig;

  owner?: UserSS | null;
  occupants?: (UserSS | null)[] | null;
  chatMsgs?: (ChatMsgSS | null)[] | null;
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
  return (await prisma.room.findMany({
    select: { id: true },
    where: {
      id: roomId,
      ownerId: userId,
    },
    first: 1,
  })).length === 1;
}

export async function userOccupiesRoom({ prisma, userId, roomId }: {
  prisma: PrismaClient;
  userId?: string | null;
  roomId?: string | null;
}): Promise<boolean> {
  if (!userId || !roomId) {
    return false;
  }
  return (await prisma.room.findMany({
    select: { id: true },
    where: {
      id: roomId,
      occupants: { some: { B: userId } },
    },
    first: 1,
  })).length === 1;
}
