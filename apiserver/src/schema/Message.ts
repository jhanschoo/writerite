import { Prisma } from "@prisma/client";
import { builder } from "../builder";

export enum MessageContentType {
  TEXT = "TEXT",
  CONFIG = "CONFIG",
  ROUND_START = "ROUND_START",
  ROUND_WIN = "ROUND_WIN",
  ROUND_SCORE = "ROUND_SCORE",
  CONTEST_SCORE = "CONTEST_SCORE",
}

builder.enumType(MessageContentType, {
  name: "MessageContentType",
});

export const Message = builder.prismaNode("Message", {
  authScopes: {
    authenticated: true,
  },
  id: { field: "id" },
  fields: (t) => ({
    roomId: t.exposeID("roomId"),
    senderId: t.exposeID("senderId", { nullable: true }),
    type: t.field({
      type: MessageContentType,
      resolve: ({ type }) => type as MessageContentType,
    }),
    content: t.field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ content }) => content as Prisma.JsonObject | null,
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),

    sender: t.relation("sender"),
    room: t.relation("room"),
  }),
});
