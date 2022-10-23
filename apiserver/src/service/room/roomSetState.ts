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
      const updateResult = await prisma.room.updateMany({
        where: { id, ownerId: currentUserId, state: RoomState.Waiting, deckId: { not: null } },
        data: { state },
      });
      if (!updateResult.count) {
        throw invalidArgumentsErrorFactory(`Unable to find room with id ${id} in WAITING state already configured with a deck`);
      }
      break;
    }
    case RoomState.Served: {
      const updateResult = await prisma.room.updateMany({
        // TODO: there may be additional arguments to this as we progress coding
        where: { id, ownerId: currentUserId, state: RoomState.Waiting },
        data: { state },
      });
      if (!updateResult.count) {
        throw invalidArgumentsErrorFactory(`Unable to find room with id ${id} in SERVED state`);
      }
      break;
    }
    default:
      throw invalidArgumentsErrorFactory(`Unknown state ${state as string}`);
  }
  return prisma.room.findUniqueOrThrow({ where: { id } });
};
