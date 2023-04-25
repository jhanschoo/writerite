import { decodeGlobalID } from '@pothos/plugin-relay';
import { Deck as PDeck, Prisma } from 'database';

import { builder, gao, ungao } from '../builder';
import { getDescendantsOfDeck } from '../service/deck';
import { DecksQueryScope } from './enums';
import {
  CardCreateMutationInput,
  DeckCreateMutationInput,
  DeckEditMutationInput,
} from './inputs';
import { DecksQueryInput } from './inputs/DecksQueryInput';

export const PPUBLIC = gao('getPublicInfo');
export const PPRIVATABLE = gao('getPrivatableInfo');
export const PPERSONAL = gao('getPersonalInfo');
export const PEDIT = gao('editInfo');
const OWNER_PERMS = ungao([PPUBLIC, PPRIVATABLE, PPERSONAL, PEDIT]);
const PUBLIC_DECK_PERMS = ungao([PPUBLIC, PPRIVATABLE]);
const PUBLIC_PERMS = ungao([PPUBLIC]);

export const Deck = builder.prismaNode('Deck', {
  authScopes: {
    authenticated: true,
  },
  grantScopes: ({ ownerId, published }, { sub }) => {
    if (sub?.bareId === ownerId) {
      return OWNER_PERMS;
    }
    if (published) {
      return PUBLIC_DECK_PERMS;
    }
    return PUBLIC_PERMS;
  },
  id: { field: 'id' },
  fields: (t) => ({
    // ID's if revealed, need to be converted to global IDs
    // ownerId: t.withAuth(PPRIVATABLE).exposeID("ownerId"),
    name: t.withAuth(PPRIVATABLE).exposeString('name'),
    description: t.withAuth(PPRIVATABLE).field({
      type: 'JSONObject',
      nullable: true,
      resolve: ({ description }) => description as Prisma.JsonObject | null,
    }),
    promptLang: t.withAuth(PPRIVATABLE).exposeString('promptLang'),
    answerLang: t.withAuth(PPRIVATABLE).exposeString('answerLang'),
    published: t.withAuth(PPRIVATABLE).exposeBoolean('published'),
    sortData: t.withAuth(PPRIVATABLE).exposeStringList('sortData'),
    createdAt: t
      .withAuth(PPRIVATABLE)
      .expose('createdAt', { type: 'DateTime' }),
    editedAt: t.withAuth(PPRIVATABLE).expose('editedAt', { type: 'DateTime' }),

    owner: t.withAuth(PPRIVATABLE).relation('owner'),
    cardsDirect: t.withAuth(PPRIVATABLE).relatedConnection('cards', {
      description: 'all cards directly belonging to this deck',
      cursor: 'id',
    }),
    cardsDirectCount: t.withAuth(PPRIVATABLE).relationCount('cards', {
      description: 'number of all cards directly belonging to this deck',
    }),
    ownRecordNotes: t.withAuth(PPUBLIC).field({
      type: 'JSONObject',
      nullable: true,
      select: (_args, { sub }) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        records: { where: { userId: sub!.bareId }, select: { notes: true } },
      }),
      resolve: ({ records }) => {
        const notes = records[0]?.notes ?? null;
        return notes as Prisma.JsonObject | null;
      },
    }),
  }),
});

builder.prismaObjectFields('Deck', (t) => ({
  descendantDecks: t.withAuth(PPRIVATABLE).field({
    type: [Deck],
    description:
      'all descendant decks (reflexive, transitive closure of subdeck) of this deck',
    async resolve({ id }, _args, { prisma }) {
      return getDescendantsOfDeck(prisma, id);
    },
  }),
}));

export enum DecksQueryOrder {
  EDITED_RECENCY = 'EDITED_RECENCY',
  USED_RECENCY = 'USED_RECENCY',
}

// builder.enumType(DecksQueryOrder, {
//   name: "DecksQueryOrder",
//   description: "order in which decks are returned",
// });

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
      const { bareId: userId } = sub!;
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
    cursor: 'id',
    args: {
      input: t.arg({ type: DecksQueryInput, required: true }),
    },
    resolve: async (
      query,
      _root,
      { input: { scope, stoplist, titleContains } },
      { prisma, sub }
    ) => {
      const { bareId: userId } = sub;
      const res = await prisma.deck.findMany({
        ...query,
        where: {
          ...(scope === DecksQueryScope.OWNED
            ? { ownerId: userId }
            : { OR: [{ ownerId: userId }, { published: true }] }),
          id: stoplist
            ? { notIn: stoplist.map((id) => decodeGlobalID(id as string).id) }
            : undefined,
          name: titleContains ? { contains: titleContains } : undefined,
        },
        orderBy: { editedAt: 'desc' },
      });
      return res;
    },
  }),
}));

builder.mutationFields((t) => ({
  deckCreate: t.withAuth({ authenticated: true }).prismaField({
    type: Deck,
    description: 'create a new deck',
    args: {
      input: t.arg({ type: DeckCreateMutationInput, required: true }),
    },
    resolve: async (
      query,
      _root,
      {
        input: { cards, description, parentDeckId, published, notes, ...rest },
      },
      { prisma, sub }
    ) => {
      parentDeckId = parentDeckId ? decodeGlobalID(parentDeckId as string).id : null;
      const res = await prisma.deck.create({
        ...query,
        data: {
          ownerId: sub.bareId,
          description: description === null ? Prisma.DbNull : description,
          ...rest,
          published: published ?? false,
          cards: { create: cards },
          subdeckIn: parentDeckId
            ? {
                create: {
                  parentDeck: {
                    connect: {
                      id: parentDeckId as string,
                      ownerId: sub.bareId,
                    },
                  },
                },
              }
            : undefined,
          records: notes
            ? {
                create: {
                  userId: sub.bareId,
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
    description: 'edit a new deck',
    args: {
      input: t.arg({ type: DeckEditMutationInput, required: true }),
    },
    resolve: async (
      query,
      _root,
      { input: { id, description, name, promptLang, answerLang, notes } },
      { prisma, sub }
    ) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.bareId },
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
                    userId_deckId: { userId: sub.bareId, deckId: id },
                  },
                  update: { notes },
                  create: { userId: sub.bareId, notes },
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
    description: 'add cards to a deck',
    args: {
      deckId: t.arg.id({ required: true }),
      cards: t.arg({ type: [CardCreateMutationInput], required: true }),
    },
    resolve: async (query, _root, { deckId, cards }, { prisma, sub }) => {
      const { id } = decodeGlobalID(deckId as string);
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.bareId },
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
    description: 'add a subdeck to a deck and resolve to the parent deck',
    args: {
      deckId: t.arg.id({ required: true }),
      subdeckId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { deckId, subdeckId }, { prisma, sub }) => {
      const { id } = decodeGlobalID(deckId as string);
      subdeckId = decodeGlobalID(subdeckId as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.bareId },
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
    description: 'add a subdeck to a deck and resolve to the parent deck',
    args: {
      deckId: t.arg.id({ required: true }),
      subdeckId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { deckId, subdeckId }, { prisma, sub }) => {
      const { id } = decodeGlobalID(deckId as string);
      subdeckId = decodeGlobalID(subdeckId as string).id;
      const res = await prisma.deck.update({
        ...query,
        where: { id, ownerId: sub.bareId },
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
      'delete the specified deck, only if its dependents are deleted',
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
    description: 'set personal notes for a deck',
    args: {
      deckId: t.arg.id({ required: true }),
      notes: t.arg({ type: 'JSONObject', required: true }),
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
                userId_deckId: { userId: sub.bareId, deckId },
              },
              update: { notes },
              create: { userId: sub.bareId, notes },
            },
          },
        },
      });
      return res;
    },
  }),
}));
