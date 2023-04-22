import { Prisma } from "database";
import { builder } from "../builder";
import {
  CurrentUser,
  currentUserToUserJWT,
  verifyStaleUserJWT,
} from "../service/userJWT";
import {
  findOrCreateCurrentUserSourceWithProfile,
  currentUserSourceToCurrentUser,
} from "../service/authentication";

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

builder.mutationField("refresh", (t) =>
  t.field({
    type: SessionInfo,
    nullable: true,
    args: {
      token: t.arg({ type: "JWT", description: "A JWT token", required: true }),
    },
    resolve: async (_parent, { token }, { prisma }) => {
      try {
        const { sub } = await verifyStaleUserJWT(token);
        const currentUserSource =
          await findOrCreateCurrentUserSourceWithProfile(
            prisma,
            sub.bareId,
            "id"
          );
        const currentUser = currentUserSourceToCurrentUser(currentUserSource);
        return new SessionInfo(
          await currentUserToUserJWT(currentUser),
          currentUser
        );
      } catch (e) {
        return null;
      }
    },
  })
);
