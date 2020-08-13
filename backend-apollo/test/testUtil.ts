import { PrismaClient } from "@prisma/client";
import { run } from "promise-dag";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function cascadingDelete(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return run({
    userCardRecord: [() => prisma.userCardRecord.deleteMany({})],
    userDeckRecord: [() => prisma.userDeckRecord.deleteMany({})],
    subdeck: [() => prisma.subdeck.deleteMany({})],
    occupant: [() => prisma.occupant.deleteMany({})],
    chatMsg: [() => prisma.chatMsg.deleteMany({})],
    room: ["chatMsg", "occupant", () => prisma.room.deleteMany({})],
    card: ["userCardRecord", () => prisma.card.deleteMany({})],
    deck: ["card", "userDeckRecord", "subdeck", () => prisma.deck.deleteMany({})],
    user: ["deck", "room", "chatMsg", "occupant", "userDeckRecord", "userCardRecord", () => prisma.user.deleteMany({})],
  });
}
