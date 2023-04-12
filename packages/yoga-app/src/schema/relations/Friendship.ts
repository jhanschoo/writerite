import { prismaConnectionHelpers } from "@pothos/plugin-prisma";
import { builder } from "../../builder";
import { PPRIVATABLE, User } from "../User";

export const Friendship = builder.prismaNode("Friendship", {
  id: { field: "id" },
  fields: (t) => ({
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    befriender: t.relation("befriender"),
    befriended: t.relation("befriended"),
  }),
});

const befriendedConnectionHelpers = prismaConnectionHelpers(
  builder,
  Friendship,
  {
    cursor: "id",
    select: (nodeSelection) => ({
      befriended: nodeSelection(true),
    }),
    resolveNode: ({ befriended }) => befriended,
  }
);

const befrienderConnectionHelpers = prismaConnectionHelpers(
  builder,
  Friendship,
  {
    cursor: "id",
    select: (nodeSelection) => ({
      befriender: nodeSelection(true),
    }),
    resolveNode: ({ befriender }) => befriender,
  }
);

builder.prismaObjectFields("User", (t) => ({
  befriendeds: t.withAuth(PPRIVATABLE).connection({
    type: User,
    description: "users this user has befriended",
    select: (args, ctx, nestedSelection) => {
      const befrienderIn = befriendedConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      );
      return {
        befrienderIn: befrienderIn as typeof befrienderIn & {
          cursor?: { id: string };
        },
      };
    },
    resolve: (user, args, ctx) =>
      befriendedConnectionHelpers.resolve(user.befrienderIn, args, ctx),
  }),
  mutualBefriendeds: t.withAuth(PPRIVATABLE).connection({
    type: User,
    description:
      "users befriending you that this user has befriended; upon own user gives your mutual friends",
    select: (args, ctx, nestedSelection) => {
      const befrienderIn = befriendedConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      );
      return {
        befrienderIn: {
          ...(befrienderIn as typeof befrienderIn & {
            cursor?: { id: string };
          }),
          where: {
            befriended: {
              befrienderIn: { some: { befriendedId: ctx.sub!.id } },
            },
          },
        },
      };
    },
    resolve: (user, args, ctx) =>
      befriendedConnectionHelpers.resolve(user.befrienderIn, args, ctx),
  }),
  befrienders: t.withAuth(PPRIVATABLE).connection({
    type: User,
    description: "users that have befriended this user and you",
    select: (args, ctx, nestedSelection) => {
      const befriendedIn = befrienderConnectionHelpers.getQuery(
        args,
        ctx,
        nestedSelection
      );
      return {
        befriendedIn: {
          ...(befriendedIn as typeof befriendedIn & {
            cursor?: { id: string };
          }),
          where: {
            befriender: {
              befrienderIn: { some: { befriendedId: ctx.sub!.id } },
            },
          },
        },
      };
    },
    resolve: (user, args, ctx) =>
      befrienderConnectionHelpers.resolve(user.befriendedIn, args, ctx),
  }),
}));
