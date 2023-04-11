import { builder } from "../../builder";
import { prismaConnectionHelpers } from "@pothos/plugin-prisma";
import { Deck, PPRIVATABLE } from "../Deck";

export const Subdeck = builder.prismaNode("Subdeck", {
  id: { field: "id" },
  fields: (t) => ({
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    parentDeck: t.relation("parentDeck"),
    subdeck: t.relation("subdeck"),
  }),
});

const subdeckConnectionHelpers = prismaConnectionHelpers(builder, Subdeck, {
  cursor: "id",
  select: (nodeSelection) => ({
    subdeck: nodeSelection(true),
  }),
  resolveNode: ({ subdeck }) => subdeck,
});

builder.prismaObjectFields("Deck", (t) => ({
  subdecks: t.withAuth(PPRIVATABLE).connection({
    type: Deck,
    description: "all subdecks directly belonging to this deck",
    select: (args, ctx, nestedSelection) => ({
      parentDeckIn: subdeckConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      ) as ReturnType<typeof subdeckConnectionHelpers.getQuery> & {
        cursor?: { id: string };
      },
    }),
    resolve: (deck, args, ctx) =>
      subdeckConnectionHelpers.resolve(deck.parentDeckIn, args, ctx),
  }),
  subdecksCount: t.withAuth(PPRIVATABLE).relationCount("parentDeckIn"),
}));
