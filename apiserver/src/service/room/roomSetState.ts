import { PrismaClient } from "@prisma/client";
import { RoomState } from "../../../generated/typescript-operations";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";

type RoomSetDeckProps = [PrismaClient, { id: string, state: RoomState }];

export const roomSetState = async (...[prisma, { id, state }]: RoomSetDeckProps) => {
  switch (state) {
    case RoomState.Waiting: {
      throw invalidArgumentsErrorFactory("Transitioning to an initial state is illegal.");
    }
    case RoomState.Serving: {
      const updateResult = await prisma.room.updateMany({
        where: { id, state: RoomState.Waiting, deckId: { not: null } },
        data: { state },
      });
      if (!updateResult.count) {
        throw invalidArgumentsErrorFactory(`Unable to find room with id ${id} in WAITING state already configured with a deck`);
      }
      break;
    }
    case RoomState.Served: {
      const updateResult = await prisma.room.updateMany({
        where: { id, state: RoomState.Waiting },
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
