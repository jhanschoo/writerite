import { PrismaClient, RoomState } from "@prisma/client";
import { invalidArgumentsErrorFactory } from "../../error";

type RoomSetStateProps = [
  PrismaClient,
  { id: string; state: RoomState; currentUserId: string }
];

export const roomSetState = async (
  ...[prisma, { id, state, currentUserId }]: RoomSetStateProps
) => {
  switch (state) {
    case RoomState.WAITING: {
      throw invalidArgumentsErrorFactory(
        "Transitioning to an initial state is illegal."
      );
    }
    case RoomState.SERVING: {
      return prisma.room.update({
        where: {
          id,
          occupants: { some: { occupantId: currentUserId } },
          state: RoomState.WAITING,
          deckId: { not: null },
        },
        data: { state },
      });
    }
    case RoomState.SERVED: {
      return prisma.room.update({
        // TODO: there may be additional arguments to this as we progress coding
        where: {
          id,
          occupants: { some: { occupantId: currentUserId } },
          state: RoomState.WAITING,
        },
        data: { state, slug: null },
      });
    }
    default:
      throw invalidArgumentsErrorFactory(`Unknown state ${state as string}`);
  }
};
