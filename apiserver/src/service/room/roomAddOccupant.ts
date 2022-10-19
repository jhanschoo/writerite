import { PrismaClient } from "@prisma/client";
import { userLacksPermissionsErrorFactory } from "../../error/userLacksPermissionsErrorFactory";

type RoomAddOccupantProps = [PrismaClient, { roomId: string, occupantId: string, currentUserId?: string }];

export const roomAddOccupant = async (...[prisma, { roomId, occupantId, currentUserId }]: RoomAddOccupantProps) => {
  if (currentUserId && currentUserId !== occupantId) {
    if (currentUserId !== (await prisma.room.findUnique({ where: { id: roomId } }))?.ownerId) {
      throw userLacksPermissionsErrorFactory();
    }
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
