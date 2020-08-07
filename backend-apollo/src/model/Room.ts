import type { JsonObject, PrismaClient, Room, RoomState } from "@prisma/client";
import type { UserSS } from "./User";
import type { ChatMsgSS } from "./ChatMsg";

// RoomStoredScalars
export interface RoomSS extends Partial<Room> {
  id: string;
  ownerId: string;
  ownerConfig: JsonObject;
  internalConfig: JsonObject;
  state: RoomState;

  createdAt: Date;
  updatedAt: Date;

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
  const { ownerConfig, internalConfig } = room;
  return {
    ...room,
    ownerConfig: ownerConfig as JsonObject,
    internalConfig: internalConfig as JsonObject,
  };
}
