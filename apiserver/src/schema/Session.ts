import { Prisma } from "@prisma/client";
import { builder } from "../builder";
import { CurrentUser } from "../service/userJWT";

export class SessionInfo {
  public readonly currentUser: Prisma.JsonObject;
  constructor(public readonly token: string, currentUser: CurrentUser) {
    this.currentUser = currentUser as unknown as Prisma.JsonObject;
  }
}

builder.objectType(SessionInfo, {
  name: "SessionInfo",
  description: "A token and its contained information",
  fields: (t) => ({
    token: t.expose("token", { type: "JWT" }),
    currentUser: t.expose("currentUser", { type: "JSONObject" }),
  }),
});
