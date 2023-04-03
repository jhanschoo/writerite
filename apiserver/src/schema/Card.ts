import { Prisma, Unit } from "@prisma/client";
import { builder } from "../builder";

/**
 * Cards have no access control, and they must not naively appear top-level.
 */
export const Card = builder.prismaNode("Card", {
  authScopes: {
    authenticated: true,
  },
  id: { field: "id" },
  fields: (t) => ({
    prompt: t.field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ prompt }) => prompt as Prisma.JsonObject | null,
    }),
    fullAnswer: t.field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ fullAnswer }) => fullAnswer as Prisma.JsonObject | null,
    }),
    answers: t.exposeStringList("answers"),
    template: t.exposeBoolean("template"),
    mainTemplate: t.field({
      type: "Boolean",
      resolve: ({ default: isDefault }) => {
        return isDefault === Unit.UNIT;
      },
    }),
    editedAt: t.expose("editedAt", { type: "DateTime" }),
    deckId: t.exposeID("deckId"),
  }),
});
