import { PrismaClient } from "@prisma/client";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";
import { roomAddOccupant } from "./roomAddOccupant";

type RoomAddOccupantProps = [PrismaClient, { roomId: string, name: string }];

export const roomAddOccupantByName = async (...[prisma, { roomId, name }]: RoomAddOccupantProps) => {
  const findOccupantRes = await prisma.user.findUnique({ select: { id: true }, where: { name } });
  if (!findOccupantRes) {
    throw invalidArgumentsErrorFactory();
  }
  return roomAddOccupant(prisma, { roomId, occupantId: findOccupantRes.id });
};
