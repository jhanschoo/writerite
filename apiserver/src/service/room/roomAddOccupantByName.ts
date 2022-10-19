import { PrismaClient } from "@prisma/client";
import { roomAddOccupant } from "./roomAddOccupant";

type RoomAddOccupantProps = [PrismaClient, { roomId: string, name: string }];

export const roomAddOccupantByName = async (...[prisma, { roomId, name }]: RoomAddOccupantProps) => {
  const { id } = await prisma.user.findUniqueOrThrow({ select: { id: true }, where: { name } });
  return roomAddOccupant(prisma, { roomId, occupantId: id });
};
