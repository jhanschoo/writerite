import type { JsonObject, PrismaClient, Room, RoomState, RoomWhereInput } from "@prisma/client";
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

export const roomsTopic = "rooms";

export function roomTopic(id: string): string {
  return `room#${id}`;
}

export async function userOwnsRoom({ prisma, where }: {
  prisma: PrismaClient;
  where?: RoomWhereInput;
}): Promise<boolean> {
  const { id, ownerId } = where ?? {};
  if (!ownerId || !id) {
    return false;
  }
  return await prisma.room.count({
    where,
  }) === 1;
}

export async function userOccupiesRoom({ prisma, occupantId, where }: {
  prisma: PrismaClient;
  occupantId?: string;
  where?: RoomWhereInput;
}): Promise<boolean> {
  const { id } = where ?? {};
  if (!occupantId || !id) {
    return false;
  }
  return await prisma.room.count({
    where: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      occupants: occupantId ? { some: { occupantId } } : undefined,
      ...where,
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
