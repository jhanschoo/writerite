import { PrismaClient } from '@prisma/client';
import { WillNotServeRoomStates } from './constants';

type RoomFindOccupyingActiveOfUserProps = [PrismaClient, { occupantId: string }];

export const roomFindOccupyingActiveOfUser = async (
  ...[prisma, { occupantId }]: RoomFindOccupyingActiveOfUserProps
) =>
  prisma.room.findMany({
    where: { state: { notIn: WillNotServeRoomStates }, occupants: { some: { occupantId } } },
  });
