import { PrismaClient } from "@prisma/client";
import { RoomState } from "../../../generated/typescript-operations";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";
import { userLacksPermissionsErrorFactory } from "../../error/userLacksPermissionsErrorFactory";

type RoomAddOccupantProps = [PrismaClient, { roomId: string, occupantId: string, currentUserId?: string }];

export const roomAddOccupant = async (...[prisma, { roomId, occupantId, currentUserId }]: RoomAddOccupantProps) => {
  const room = await prisma.room.findFirst({ select: { ownerId: true }, where: { id: roomId, state: RoomState.Waiting } });
  if (room === null) {
    throw invalidArgumentsErrorFactory();
  }
  if (currentUserId && currentUserId !== occupantId && currentUserId !== room.ownerId) {
    throw userLacksPermissionsErrorFactory();
  }
  const occupant = await prisma.occupant.upsert({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { roomId_occupantId: { roomId, occupantId } },
    create: { room: { connect: { id: roomId } }, occupant: { connect: { id: occupantId } } },
    update: {},
    include: { room: true },
  });
  return occupant.room;
};
