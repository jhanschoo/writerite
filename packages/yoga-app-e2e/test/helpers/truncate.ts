import { PrismaClient } from "database";
import { run } from "promise-dag";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function cascadingDelete(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return run({
    userCardRecord: [() => prisma.userCardRecord.deleteMany({})],
    userDeckRecord: [() => prisma.userDeckRecord.deleteMany({})],
    subdeck: [() => prisma.subdeck.deleteMany({})],
    occupant: [() => prisma.occupant.deleteMany({})],
    message: [() => prisma.message.deleteMany({})],
    room: ["message", "occupant", "round", () => prisma.room.deleteMany({})],
    round: [() => prisma.round.deleteMany({})],
    card: ["userCardRecord", () => prisma.card.deleteMany({})],
    deck: [
      "card",
      "userDeckRecord",
      "round",
      "subdeck",
      () => prisma.deck.deleteMany({}),
    ],
    user: [
      "deck",
      "room",
      "message",
      "occupant",
      "userDeckRecord",
      "userCardRecord",
      () => prisma.user.deleteMany({}),
    ],
  });
}
