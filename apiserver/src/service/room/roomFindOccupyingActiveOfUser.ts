import { PrismaClient } from '@prisma/client';
import { WillNotServeRoomStates } from './constants';

type RoomSetDeckProps = [PrismaClient, { occupantId: string }];

export const roomFindOccupyingActiveOfUser = async (
  ...[prisma, { occupantId }]: RoomSetDeckProps
) =>
  prisma.room.findMany({
    where: { state: { notIn: WillNotServeRoomStates }, occupants: { some: { occupantId } } },
  });