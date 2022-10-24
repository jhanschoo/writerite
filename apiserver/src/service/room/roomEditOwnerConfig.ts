import { Prisma, PrismaClient } from "@prisma/client";

type RoomSetDeckProps = [PrismaClient, { id: string, ownerConfig: Prisma.InputJsonObject }];

export const roomEditOwnerConfig = async (...[prisma, { id, ownerConfig }]: RoomSetDeckProps) => prisma.room.update({
  where: { id, state: "WAITING" },
  data: { ownerConfig },
});
