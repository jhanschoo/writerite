import { Prisma, PrismaClient } from "@prisma/client";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";

type RoomSetDeckProps = [PrismaClient, { id: string, ownerConfig: Prisma.InputJsonObject }];

export const roomEditOwnerConfig = async (...[prisma, { id, ownerConfig }]: RoomSetDeckProps) => {
  const updateResult = await prisma.room.updateMany({
    where: { id, state: "WAITING" },
    data: { ownerConfig },
  });
  if (!updateResult.count) {
    throw invalidArgumentsErrorFactory(`Invalid ownerConfig or unable to find room with id ${id} in WAITING state`);
  }
  return prisma.room.findUniqueOrThrow({ where: { id } });
};
