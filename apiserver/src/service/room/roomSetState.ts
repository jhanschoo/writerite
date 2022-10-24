import { PrismaClient } from "@prisma/client";
import { RoomState } from "../../../generated/typescript-operations";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";

type RoomSetStateProps = [PrismaClient, { id: string, state: RoomState, currentUserId: string }];

export const roomSetState = async (...[prisma, { id, state, currentUserId }]: RoomSetStateProps) => {
  switch (state) {
    case RoomState.Waiting: {
      throw invalidArgumentsErrorFactory("Transitioning to an initial state is illegal.");
    }
    case RoomState.Serving: {
      return prisma.room.update({
        where: { id, ownerId: currentUserId, state: RoomState.Waiting, deckId: { not: null } },
        data: { state },
      });
    }
    case RoomState.Served: {
      return prisma.room.update({
        // TODO: there may be additional arguments to this as we progress coding
        where: { id, ownerId: currentUserId, state: RoomState.Waiting },
        data: { state },
      });
    }
    default:
      throw invalidArgumentsErrorFactory(`Unknown state ${state as string}`);
  }
};
