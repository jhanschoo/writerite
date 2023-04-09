import { invalidateByUserId } from "../service/session";
import { builder, gao, ungao } from "../builder";
import { Prisma } from "@prisma/client";
import { invalidArgumentsErrorFactory } from "../error";
import { decodeGlobalID } from "@pothos/plugin-relay";

export const PPUBLIC = gao("getPublicInfo");
export const PPRIVATABLE = gao("getPrivatableInfo");
export const PPERSONAL = gao("getPersonalInfo");

// SELF_PERMS is the minimal set of permissions that a user has on themselves.
const SELF_PERMS = ungao([PPUBLIC, PPRIVATABLE, PPERSONAL]);
// PUBLIC_PROFILE_PERMS is the minimal set of permissions that a user has on a public profile.
const PUBLIC_PROFILE_PERMS = ungao([PPUBLIC, PPRIVATABLE]);
// PUBLIC_PERMS is the minimal set of permissions that a user has on a private profile.
const PUBLIC_PERMS = ungao([PPUBLIC]);

/**
 * Authorization policy: PII and roles are only accessible to the user themselves,
 * everything else is accessible to everyone.
 */
export const User = builder.prismaNode("User", {
  authScopes: {
    authenticated: true,
  },
  grantScopes: ({ id, isPublic }, { sub }) => {
    if (sub?.id === id) {
      return SELF_PERMS;
    }
    if (isPublic) {
      return PUBLIC_PROFILE_PERMS;
    }
    return PUBLIC_PERMS;
  },
  id: { field: "id" },
  fields: (t) => ({
    name: t.withAuth(PPUBLIC).exposeString("name"),
    googleId: t
      .withAuth(PPERSONAL)
      .exposeString("googleId", { nullable: true }),
    facebookId: t
      .withAuth(PPERSONAL)
      .exposeString("facebookId", { nullable: true }),
    bio: t.withAuth(PPUBLIC).field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ bio }) => bio as Prisma.JsonObject | null,
    }),
    roles: t.withAuth(PPERSONAL).exposeStringList("roles"),
    isPublic: t.withAuth(PPUBLIC).exposeBoolean("isPublic", {
      description:
        "whether the user's profile information is accessible by non-friends and searchable",
    }),
    decks: t.withAuth(PPRIVATABLE).relatedConnection("decks", { cursor: "id" }),
    befriendedsCount: t.withAuth(PPRIVATABLE).relationCount("befrienderIn"),
    befriendersCount: t.withAuth(PPRIVATABLE).relationCount("befriendedIn"),
  }),
});

builder.queryFields((t) => ({
  me: t.withAuth({ authenticated: true }).prismaField({
    type: User,
    nullable: true,
    resolve: (query, _root, _args, { prisma, sub }) =>
      prisma.user.findUnique({
        ...query,
        where: { id: sub.id },
      }),
  }),
}));

builder.mutationFields((t) => ({
  ownProfileEdit: t.withAuth({ authenticated: true }).prismaField({
    type: User,
    description: "Edit the user's own profile.",
    args: {
      name: t.arg.string({ directives: { undefinedOnly: true } }),
      bio: t.arg({ type: "JSONObject", directives: { undefinedOnly: true } }),
      isPublic: t.arg.boolean({ directives: { undefinedOnly: true } }),
    },
    directives: {
      invalidatesTokens: true,
    },
    resolve: async (
      query,
      _parent,
      { name, bio, isPublic },
      { prisma, redis, sub }
    ) => {
      const { id } = sub;
      const userRes = await prisma.user.update({
        ...query,
        where: { id },
        data: {
          name: name ?? undefined,
          bio: bio === null ? Prisma.DbNull : bio,
          isPublic: isPublic === null ? undefined : isPublic,
        },
      });
      await invalidateByUserId(redis, id);
      return userRes;
    },
  }),
  befriend: t.withAuth({ authenticated: true }).prismaField({
    type: User,
    description:
      "Befriend the `befriendedId` user, then resolves to the user's own profile",
    args: {
      befriendedId: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, { befriendedId }, { prisma, sub }) => {
      befriendedId = decodeGlobalID(befriendedId as string).id;
      if (befriendedId === sub.id) {
        throw invalidArgumentsErrorFactory("You cannot befriend yourself.");
      }
      const userRes = await prisma.user.update({
        ...query,
        where: { id: sub.id },
        data: {
          befrienderIn: {
            connectOrCreate: {
              where: {
                befrienderId_befriendedId: {
                  befrienderId: sub.id,
                  befriendedId,
                },
              },
              create: { befriendedId },
            },
          },
        },
      });
      return userRes;
    },
  }),
}));
