import { Prisma, PrismaClient } from '@prisma/client';

type RoomEditOwnerConfigProps = [PrismaClient, { id: string; ownerConfig: Prisma.InputJsonObject }];

export const roomEditOwnerConfig = async (
  ...[prisma, { id, ownerConfig }]: RoomEditOwnerConfigProps
) =>
  prisma.room.update({
    where: { id, state: 'WAITING' },
    data: { ownerConfig },
  });
