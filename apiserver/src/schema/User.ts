import { builder, gao, ungao } from "../builder";
import { Prisma } from "@prisma/client";

export const PPUBLIC = gao("getPublicInfo");
export const PPRIVATABLE = gao("getPrivatableInfo");
export const PPERSONAL = gao("getPersonalInfo");
export const PEDIT = gao("editInfo");

// SELF_PERMS is the minimal set of permissions that a user has on themselves.
const SELF_PERMS = ungao([PPUBLIC, PPRIVATABLE, PPERSONAL, PEDIT]);
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
  grantScopes: ({ id, isPublic }, { auth }) => {
    if (auth.isLoggedInAs(id)) {
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
    resolve: (query, parent, _args, { prisma, sub }) =>
      prisma.user.findUnique({
        ...query,
        where: { id: sub.id },
      }),
  }),
}));
