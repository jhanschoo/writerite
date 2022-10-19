import { PrismaClient } from "@prisma/client";
import { RoomState } from "../../../generated/typescript-operations";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";

type RoomSetDeckProps = [PrismaClient, { roomId: string, deckId: string, currentUserId?: string }];

export const roomSetDeck = async (...[prisma, { roomId: id, deckId, currentUserId }]: RoomSetDeckProps) => {
  const updateResult = await prisma.room.updateMany({
    where: { id, state: RoomState.Waiting, ownerId: currentUserId },
    data: { deckId },
  });
  if (!updateResult.count) {
    throw invalidArgumentsErrorFactory(`Unable to find room with id ${id} in WAITING state or deck with id ${deckId}`);
  }
  return prisma.room.findUniqueOrThrow({ where: { id } });
};
