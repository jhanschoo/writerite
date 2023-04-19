import { builder } from "../../builder";
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

builder.prismaObjectFields("Deck", (t) => ({
  subdecks: t.withAuth(PPRIVATABLE).field({
    type: [Deck],
    description: "all subdecks directly belonging to this deck",
    select: (_args, _ctx, nestedSelection) => ({
      parentDeckIn: {
        select: {
          subdeck: nestedSelection(true),
        },
      },
    }),
    resolve: (deck) => deck.parentDeckIn.map((s) => s.subdeck),
  }),
  subdecksCount: t.withAuth(PPRIVATABLE).relationCount("parentDeckIn"),
}));
