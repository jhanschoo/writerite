import { Deck as PDeck, Prisma } from "database";
import { getDescendantsOfDeck } from "../service/deck";
import { builder, gao, ungao } from "../builder";
import { CardInput } from "./inputs/CardInput";
import { decodeGlobalID } from "@pothos/plugin-relay";

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
  grantScopes: ({ ownerId, published }, { sub }) => {
    if (sub?.id === ownerId) {
      return OWNER_PERMS;
    }
    if (published) {
      return PUBLIC_DECK_PERMS;
    }
    return PUBLIC_PERMS;
  },
  id: { field: "id" },
  fields: (t) => ({
    // ID's if revealed, need to be converted to global IDs
    // ownerId: t.withAuth(PPRIVATABLE).exposeID("ownerId"),
    name: t.withAuth(PPRIVATABLE).exposeString("name"),
    description: t.withAuth(PPRIVATABLE).field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ description }) => description as Prisma.JsonObject | null,
    }),
    promptLang: t.withAuth(PPRIVATABLE).exposeString("promptLang"),
    answerLang: t.withAuth(PPRIVATABLE).exposeString("answerLang"),
    published: t.withAuth(PPRIVATABLE).exposeBoolean("published"),
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
  deck: t.prismaField({
    type: Deck,
    args: {
      id: t.arg.id({ required: true }),
    },
    authScopes: {
      authenticated: true,
    },
    resolve: async (query, _root, { id }, { prisma, sub }) => {
      id = decodeGlobalID(id as string).id;
      const { id: userId } = sub!;
      const res = await prisma.deck.findUnique({
        ...query,
        where: {
          id,
          OR: [{ ownerId: userId }, { published: true }],
        },
      });
      return res as PDeck;
    },
  }),
  decks: t.withAuth({ authenticated: true }).prismaConnection({
    type: Deck,
    cursor: "id",
    args: {
      scope: t.arg({ type: DecksQueryScope }),
      stoplist: t.arg.idList(),
    },
    resolve: async (query, _root, { scope, stoplist }, { prisma, sub }) => {
      const { id: userId } = sub;
      const res = await prisma.deck.findMany({
        ...query,
        where: {
          ...(scope === DecksQueryScope.OWNED
            ? { ownerId: userId }
            : { OR: [{ ownerId: userId }, { published: true }] }),
          id: stoplist
            ? { notIn: stoplist.map((id) => decodeGlobalID(id as string).id) }
            : undefined,
        },
        orderBy: { editedAt: "desc" },
      });
      return res;
    },
  }),
}));

builder.mutationFields((t) => ({
  deckCreate: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: "create a new deck",
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg({ type: "JSONObject" }),
      promptLang: t.arg.string({ required: true, validate: { minLength: 2 } }),
      answerLang: t.arg.string({ required: true, validate: { minLength: 2 } }),
      published: t.arg.boolean(),
      cards: t.arg({ type: [CardInput], required: true }),
      parentDeckId: t.arg.id(),
      notes: t.arg({ type: "JSONObject" }),
    },
    resolve: async (
      query,
      _root,
      { cards, description, parentDeckId, published, notes, ...rest },
      { prisma, sub }
    ) => {
      const res = await prisma.deck.create({
        ...query,
        data: {
          ownerId: sub.id,
          description: description === null ? Prisma.DbNull : description,
          ...rest,
          published: published ?? false,
          cards: { create: cards },
          subdeckIn: parentDeckId
            ? {
                create: {
                  parentDeck: {
                    connect: { id: parentDeckId as string, ownerId: sub.id },
                  },
                },
              }
            : undefined,
          records: notes
            ? {
                create: {
                  userId: sub.id,
                  notes,
                },
              }
            : undefined,
        },
      });
      return res;
    },
  }),
  deckEdit: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: "edit a new deck",
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string({ directives: { undefinedOnly: true } }),
      description: t.arg({ type: "JSONObject" }),
      promptLang: t.arg.string({
        directives: { undefinedOnly: true },
        validate: { minLength: 2 },
      }),
      answerLang: t.arg.string({
        directives: { undefinedOnly: true },
        validate: { minLength: 2 },
      }),
      notes: t.arg({ type: "JSONObject" }),
    },
    resolve: async (
      query,
      _root,
      { id, description, name, promptLang, answerLang, notes },
      { prisma, sub }
    ) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.id },
        data: {
          description: description === null ? Prisma.DbNull : description,
          name: name ?? undefined,
          promptLang: promptLang ?? undefined,
          answerLang: answerLang ?? undefined,
          editedAt: new Date(),
          records: notes
            ? {
                upsert: {
                  where: {
                    userId_deckId: { userId: sub.id, deckId: id },
                  },
                  update: { notes },
                  create: { userId: sub.id, notes },
                },
              }
            : undefined,
        },
      });
      return res;
    },
  }),
  deckAddCards: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: "add cards to a deck",
    args: {
      deckId: t.arg.id({ required: true }),
      cards: t.arg({ type: [CardInput], required: true }),
    },
    resolve: async (query, _root, { deckId, cards }, { prisma, sub }) => {
      const { id } = decodeGlobalID(deckId as string);
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.id },
        data: {
          cards: { create: cards },
          editedAt: new Date(),
        },
      });
      return res;
    },
  }),
  deckAddSubdeck: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: "add a subdeck to a deck and resolve to the parent deck",
    args: {
      deckId: t.arg.id({ required: true }),
      subdeckId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { deckId, subdeckId }, { prisma, sub }) => {
      const { id } = decodeGlobalID(deckId as string);
      subdeckId = decodeGlobalID(subdeckId as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.id },
        data: {
          parentDeckIn: {
            create: {
              subdeckId,
            },
          },
          editedAt: new Date(),
        },
      });
      return res;
    },
  }),
  deckRemoveSubdeck: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: "add a subdeck to a deck and resolve to the parent deck",
    args: {
      deckId: t.arg.id({ required: true }),
      subdeckId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { deckId, subdeckId }, { prisma, sub }) => {
      const { id } = decodeGlobalID(deckId as string);
      subdeckId = decodeGlobalID(subdeckId as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.id },
        data: {
          parentDeckIn: {
            delete: {
              parentDeckId_subdeckId: {
                parentDeckId: id,
                subdeckId,
              },
            },
          },
          editedAt: new Date(),
        },
      });
      return res;
    },
  }),
  deckDelete: t.withAuth({ admin: true }).prismaField({
    type: Deck,
    description:
      "delete the specified deck, only if its dependents are deleted",
    args: {
      deckId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { deckId }, { prisma }) => {
      const { id } = decodeGlobalID(deckId as string);
      const res = await prisma.deck.delete({
        ...query,
        where: { id },
      });
      return res;
    },
  }),
  setOwnNotes: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: "set personal notes for a deck",
    args: {
      deckId: t.arg.id({ required: true }),
      notes: t.arg({ type: "JSONObject", required: true }),
    },
    resolve: async (query, _root, { deckId, notes }, { prisma, sub }) => {
      deckId = decodeGlobalID(deckId as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id: deckId },
        data: {
          records: {
            upsert: {
              where: {
                userId_deckId: { userId: sub.id, deckId },
              },
              update: { notes },
              create: { userId: sub.id, notes },
            },
          },
        },
      });
      return res;
    },
  }),
}));
