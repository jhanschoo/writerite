import { PrismaClient, RoomState } from "@prisma/client";

type RoomAddOccupantProps = [
  PrismaClient,
  { roomId: string; occupantId: string }
];

/**
 * Add an occupant who has received an invitation to a room
 * @param param0
 * @returns
 */
export const roomAddOccupant = (
  ...[prisma, { roomId, occupantId }]: RoomAddOccupantProps
) =>
  prisma.room.update({
    where: {
      id: roomId,
      state: RoomState.WAITING,
    },
    data: {
      occupants: {
        upsert: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          where: { roomId_occupantId: { roomId, occupantId } },
          update: {},
          create: { occupantId },
        },
      },
    },
  });
