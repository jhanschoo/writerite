import { PrismaClient, RoomState } from '@prisma/client';

type RoomSetDeckProps = [PrismaClient, { roomId: string; deckId: string; currentUserId?: string }];

export const roomSetDeck = async (
  ...[prisma, { roomId: id, deckId, currentUserId }]: RoomSetDeckProps
) =>
  prisma.room.update({
    where: { id, state: RoomState.WAITING, ownerId: currentUserId },
    data: { deckId },
  });
