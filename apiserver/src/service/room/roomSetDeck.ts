import { PrismaClient } from "@prisma/client";
import { RoomState } from "../../../generated/typescript-operations";

type RoomSetDeckProps = [PrismaClient, { roomId: string, deckId: string, currentUserId?: string }];

export const roomSetDeck = async (...[prisma, { roomId: id, deckId, currentUserId }]: RoomSetDeckProps) => prisma.room.update({
  where: { id, state: RoomState.Waiting, ownerId: currentUserId },
  data: { deckId },
});
