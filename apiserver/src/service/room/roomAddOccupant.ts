import { PrismaClient, RoomState } from '@prisma/client';

type RoomAddOccupantProps = [
  PrismaClient,
  { roomId: string; occupantId: string; currentUserId?: string }
];

export const roomAddOccupant = (
  ...[prisma, { roomId, occupantId, currentUserId }]: RoomAddOccupantProps
) => {
  const commonRoomWhere = { id: roomId, state: RoomState.WAITING };
  const data = {
    occupants: {
      upsert: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        where: { roomId_occupantId: { roomId, occupantId } },
        update: {},
        create: { occupantId },
      },
    },
  } as const;
  if (occupantId === currentUserId) {
    return prisma.room.update({
      where: commonRoomWhere,
      data,
    });
  }
  return prisma.room.update({
    where: { ...commonRoomWhere, ownerId: currentUserId },
    data,
  });
};
