import { Prisma } from "@prisma/client";
import { getDescendantsOfDeck } from "../service/deck";
import { builder, gao, ungao } from "../builder";
import { Roles } from "../service/userJWT";

export const PPUBLIC = gao("getPublicInfo");
export const PPRIVATABLE = gao("getPrivatableInfo");
export const PPERSONAL = gao("getPersonalInfo");
export const PEDIT = gao("editInfo");
const OWNER_PERMS = ungao([PPUBLIC, PPRIVATABLE, PPERSONAL, PEDIT]);
const PUBLIC_DECK_PERMS = ungao([PPUBLIC, PPRIVATABLE]);
const PUBLIC_PERMS = ungao([PPUBLIC]);

export const Deck = builder.prismaNode("Deck", {
  authScopes: {
    authenticated: true,
  },
  grantScopes: ({ ownerId, published }, { auth }) => {
    if (auth.isLoggedInAs(ownerId)) {
      return OWNER_PERMS;
    }
    if (published) {
      return PUBLIC_DECK_PERMS;
    }
    return PUBLIC_PERMS;
  },
  id: { field: "id" },
  fields: (t) => ({
    ownerId: t.withAuth(PPRIVATABLE).exposeID("ownerId"),
    name: t.withAuth(PPRIVATABLE).exposeString("name"),
    description: t.withAuth(PPRIVATABLE).field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ description }) => description as Prisma.JsonObject | null,
    }),
    promptLang: t.withAuth(PPRIVATABLE).exposeString("promptLang"),
    answerLang: t.withAuth(PPRIVATABLE).exposeString("answerLang"),
    sortData: t.withAuth(PPRIVATABLE).exposeStringList("sortData"),
    createdAt: t
      .withAuth(PPRIVATABLE)
      .expose("createdAt", { type: "DateTime" }),
    editedAt: t.withAuth(PPRIVATABLE).expose("editedAt", { type: "DateTime" }),

    owner: t.withAuth(PPRIVATABLE).relation("owner"),
    cardsDirect: t.withAuth(PPRIVATABLE).relatedConnection("cards", {
      description: "all cards directly belonging to this deck",
      cursor: "id",
    }),
    cardsDirectCount: t.withAuth(PPRIVATABLE).relationCount("cards", {
      description: "number of all cards directly belonging to this deck",
    }),
    ownRecordNotes: t.withAuth(PPUBLIC).field({
      type: "JSONObject",
      nullable: true,
      select: (_args, { sub }) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        records: { where: { userId: sub!.id }, select: { notes: true } },
      }),
      resolve: ({ records }) => {
        const notes = records[0]?.notes ?? null;
        return notes as Prisma.JsonObject | null;
      },
    }),
  }),
});

builder.prismaObjectFields("Deck", (t) => ({
  descendantDecks: t.withAuth(PPRIVATABLE).field({
    type: [Deck],
    description:
      "all descendant decks (reflexive, transitive closure of subdeck) of this deck",
    async resolve({ id }, _args, { prisma }) {
      return getDescendantsOfDeck(prisma, id);
    },
  }),
}));

export enum DecksQueryOrder {
  EDITED_RECENCY = "EDITED_RECENCY",
  USED_RECENCY = "USED_RECENCY",
}

export enum DecksQueryScope {
  OWNED = "OWNED",
  VISIBLE = "VISIBLE",
}

// builder.enumType(DecksQueryOrder, {
//   name: "DecksQueryOrder",
//   description: "order in which decks are returned",
// });

builder.enumType(DecksQueryScope, {
  name: "DecksQueryScope",
  description: "ownership type of of decks returned",
});

builder.queryFields((t) => ({
  deck: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: (query, _root, { id }, { prisma, sub }) => {
      const { id: userId } = sub;
      return prisma.deck.findUnique({
        ...query,
        where: {
          id: String(id),
          OR: [{ ownerId: userId }, { published: true }],
        },
      });
    },
  }),
  decks: t.withAuth({ authenticated: true }).prismaConnection({
    type: Deck,
    cursor: "id",
    args: {
      scope: t.arg({ type: DecksQueryScope }),
      stoplist: t.arg.idList(),
    },
    resolve: (query, _root, { scope, stoplist }, { prisma, sub }) => {
      const { roles, id: userId } = sub;
      return prisma.deck.findMany({
        ...query,
        where: {
          ...(scope === DecksQueryScope.OWNED
            ? { ownerId: userId }
            : { OR: [{ ownerId: userId }, { published: true }] }),
          id: stoplist ? { notIn: stoplist.map(String) } : undefined,
        },
        orderBy: { editedAt: "desc" },
      });
    },
  }),
}));
