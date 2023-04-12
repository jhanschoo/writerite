import { RoundState } from "database";
import { builder } from "../builder";

builder.enumType(RoundState, {
  name: "RoundState",
});

export const Round = builder.prismaNode("Round", {
  authScopes: {
    authenticated: true,
  },
  id: { field: "id" },
  fields: (t) => ({
    slug: t.exposeString("slug"),
    // ID's if revealed, need to be converted to global IDs
    // deckId: t.exposeID("deckId"),
    isActive: t.field({
      type: "Boolean",
      resolve: ({ isActive }) => Boolean(isActive),
    }),
    state: t.expose("state", { type: RoundState }),
    deck: t.relation("deck"),
  }),
});
