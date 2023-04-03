import { Prisma } from "@prisma/client";
import {
  arg,
  booleanArg,
  enumType,
  idArg,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { userLacksPermissionsErrorFactory } from "../error";
import { guardValidUser } from "../service/authorization/guardValidUser";
import { getDeck, getDeckAsUser, getDescendantsOfDeck } from "../service/deck";
import { jsonObjectArg } from "./scalarUtil";
import { z } from "zod";
import { jsonObjectSchema } from "../service/validation/jsonSchema";
import { Roles } from "../service/userJWT";

const DEFAULT_TAKE = 60;

function cursorParams(
  cursor?: string | null,
  take?: number | null
):
  | {
      cursor: { id: string };
      skip: number;
      take: number;
    }
  | {
      take: number;
    } {
  const actualTake = Math.min(take ?? DEFAULT_TAKE, DEFAULT_TAKE);
  if (cursor) {
    return {
      cursor: { id: cursor },
      skip: 1,
      take: actualTake + 1,
    };
  }
  return {
    take: actualTake,
  };
}

// export const Deck = objectType({
//   name: 'Deck',
//   definition(t) {
//     t.nonNull.id('id');
//     t.nonNull.id('ownerId');
//     t.nonNull.string('name');
//     t.jsonObject('description', {
//       resolve({ description }) {
//         return description as Prisma.JsonObject | null;
//       },
//     });
//     t.nonNull.string('promptLang');
//     t.nonNull.string('answerLang');
//     t.nonNull.boolean('published');
//     t.nonNull.list.nonNull.string('sortData');
//     t.nonNull.dateTime('createdAt');
//     t.nonNull.dateTime('editedAt');

//     t.nonNull.field('owner', {
//       type: 'User',
//       async resolve({ ownerId: id, owner }, _args, { prisma }) {
//         if (owner) {
//           return owner;
//         }
//         const user = await prisma.user.findUnique({ where: { id } });
//         if (!user) {
//           throw userLacksPermissionsErrorFactory(
//             'If such a user exists, you are not authorized to view it'
//           );
//         }
//         return user;
//       },
//     });
//     t.nonNull.list.nonNull.field('subdecks', {
//       type: 'Deck',
//       description: 'all direct subdecks of this deck',
//       async resolve({ id: parentDeckId }, _args, { prisma }) {
//         return prisma.deck.findMany({ where: { subdeckIn: { some: { parentDeckId } } } });
//       },
//     });
//     t.nonNull.int('subdecksCount', {
//       description: 'count of all direct subdecks of this deck',
//       async resolve({ id: parentDeckId }, _args, { prisma }) {
//         return prisma.subdeck.count({ where: { parentDeckId } });
//       },
//     });
//     t.nonNull.list.nonNull.field('descendantDecks', {
//       type: 'Deck',
//       description: 'all descendant (reflexive, transitive closure of subdeck) decks of this deck',
//       async resolve({ id }, _args, { prisma }) {
//         return getDescendantsOfDeck(prisma, id);
//       },
//     });
//     t.nonNull.list.nonNull.field('cardsDirect', {
//       type: 'Card',
//       description: 'all cards directly belonging to this deck',
//       async resolve({ id: deckId, cards }, _args, { prisma }) {
//         if (cards) {
//           return cards;
//         }
//         return prisma.card.findMany({ where: { deckId } });
//       },
//     });
//     t.nonNull.int('cardsDirectCount', {
//       description: 'number of all cards directly belonging to this deck',
//       async resolve({ id: deckId }, _args, { prisma }) {
//         return prisma.card.count({ where: { deckId } });
//       },
//     });
//     t.nonNull.list.nonNull.field('cardsAllUnder', {
//       type: 'Card',
//       description:
//         'all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck',
//       async resolve({ id }, _args, { prisma }) {
//         const decks = await getDescendantsOfDeck(prisma, id);
//         // eslint-disable-next-line @typescript-eslint/no-shadow
//         return prisma.card.findMany({ where: { deckId: { in: decks.map(({ id }) => id) } } });
//       },
//     });
//     t.field('ownRecord', {
//       type: 'UserDeckRecord',
//       async resolve({ id: deckId }, _args, { prisma, sub }) {
//         if (!sub) {
//           return null;
//         }
//         return prisma.userDeckRecord.findUnique({
//           // eslint-disable-next-line @typescript-eslint/naming-convention
//           where: { userId_deckId: { userId: sub.id, deckId } },
//         });
//       },
//     });
//   },
// });

// export const UserDeckRecord = objectType({
//   name: 'UserDeckRecord',
//   definition(t) {
//     t.nonNull.jsonObject('notes', {
//       resolve({ notes }) {
//         return notes as Prisma.JsonObject;
//       },
//     });
//   },
// });

// export const DeckQuery = queryField('deck', {
//   type: nonNull('Deck'),
//   args: {
//     id: nonNull(idArg()),
//   },
//   resolve: guardValidUser(async (_root, { id: deckId }, { prisma, sub }) => {
//     const deck = sub.roles.includes(Roles.Admin)
//       ? await getDeck(prisma, { deckId })
//       : await getDeckAsUser(prisma, { deckId, userId: sub.id });

//     if (!deck) {
//       throw userLacksPermissionsErrorFactory(
//         'If such a deck exists, you are not authorized to view it'
//       );
//     }
//     return deck;
//   }),
// });

// export const DecksQuery = queryField("decks", {
//   type: nonNull(list(nonNull("Deck"))),
//   args: {
//     cursor: idArg({ undefinedOnly: true }),
//     order: arg({
//       type: "DecksQueryOrder",
//       description:
//         "how results are ordered; if undefined, defaults to USED_RECENCY",
//     }),
//     scope: arg({
//       type: "DecksQueryScope",
//       undefinedOnly: true,
//     }),
//     stoplist: list(nonNull(idArg())),
//     take: intArg({ undefinedOnly: true }),
//     titleFilter: stringArg({ undefinedOnly: true }),
//   },
//   description: "implicit limit of 60",
//   resolve: guardValidUser(
//     async (
//       _root,
//       { cursor, order, scope, stoplist, take, titleFilter },
//       { prisma, sub },
//       _info
//     ) => {
//       if (order === "USED_RECENCY") {
//         throw new Error("not implemented");
//       }
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const OR = [
//         { ownerId: sub.id },
//         { cards: { some: { records: { some: { userId: sub.id } } } } },
//         { published: true },
//       ];
//       switch (scope) {
//         case "VISIBLE":
//           OR.length = 3;
//           break;
//         case "PARTICIPATED":
//           OR.length = 2;
//           break;
//         case "OWNED":
//         // falls through
//         default:
//           OR.length = 1;
//       }
//       return prisma.deck.findMany({
//         ...cursorParams(cursor, take),
//         where: {
//           // eslint-disable-next-line @typescript-eslint/naming-convention
//           OR,
//           name: titleFilter
//             ? {
//                 contains: titleFilter,
//               }
//             : undefined,
//           id: stoplist ? { notIn: stoplist } : undefined,
//         },
//         orderBy: { editedAt: "desc" },
//         include: {
//           owner: true,
//           cards: true,
//         },
//       });
//     }
//   ),
// });

// export const DecksQueryScope = enumType({
//   name: "DecksQueryScope",
//   members: ["OWNED", "PARTICIPATED", "VISIBLE"],
// });

// export const DecksQueryOrder = enumType({
//   name: "DecksQueryOrder",
//   members: ["EDITED_RECENCY", "USED_RECENCY"],
// });

// export const OwnDeckRecordQuery = queryField("ownDeckRecord", {
//   type: "UserDeckRecord",
//   args: {
//     deckId: nonNull(idArg()),
//   },
//   resolve: guardValidUser(async (_root, { deckId }, { prisma, sub }) =>
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     prisma.userDeckRecord.findUnique({
//       where: { userId_deckId: { userId: sub.id, deckId } },
//     })
//   ),
// });

export const deckCreateSchema = z.object({
  name: z.string().trim().optional(),
  description: jsonObjectSchema.nullable().optional(),
  promptLang: z.string().trim().min(2).optional(),
  answerLang: z.string().trim().min(2).optional(),
  parentDeckId: z.string().optional(),
  published: z.boolean().optional(),
  cards: z
    .array(
      z.object({
        answers: z.array(z.string()),
        fullAnswer: z.object({}),
        prompt: z.object({}),
        template: z.boolean().optional(),
      })
    )
    .optional(),
});

export const DeckCreateMutation = mutationField("deckCreate", {
  type: nonNull("Deck"),
  args: {
    name: stringArg({ undefinedOnly: true }),
    description: jsonObjectArg(),
    promptLang: stringArg({ undefinedOnly: true }),
    answerLang: stringArg({ undefinedOnly: true }),
    published: booleanArg({ undefinedOnly: true }),
    cards: list(
      nonNull(
        arg({
          type: "CardCreateInput",
          undefinedOnly: true,
        })
      )
    ),
    parentDeckId: idArg({ undefinedOnly: true }),
  },
  resolve: guardValidUser(async (_root, args, { prisma, sub }) => {
    const { cards, description, parentDeckId, ...rest } =
      deckCreateSchema.parse(args);

    return prisma.deck.create({
      data: {
        ownerId: sub.id,
        description: description === null ? Prisma.DbNull : description,
        ...rest,
        cards: { create: cards },
        subdeckIn: parentDeckId
          ? {
              create: {
                parentDeck: { connect: { id: parentDeckId, ownerId: sub.id } },
              },
            }
          : undefined,
      },
    });
  }),
});

export const deckEditSchema = z.object({
  id: z.string().min(20),
  name: z.string().trim().optional(),
  description: jsonObjectSchema.nullable().optional(),
  promptLang: z.string().trim().min(2).optional(),
  answerLang: z.string().trim().min(2).optional(),
  published: z.boolean().optional(),
});

export const DeckEditMutation = mutationField("deckEdit", {
  type: nonNull("Deck"),
  args: {
    id: nonNull(idArg()),
    name: stringArg({ undefinedOnly: true }),
    description: jsonObjectArg(),
    promptLang: stringArg({ undefinedOnly: true }),
    answerLang: stringArg({ undefinedOnly: true }),
    published: booleanArg({ undefinedOnly: true }),
  },
  resolve: guardValidUser(async (_root, args, { prisma, sub }) => {
    const { id, description, ...data } = deckEditSchema.parse(args);
    return prisma.deck.update({
      where: { id, ownerId: sub.id },
      data: {
        ...data,
        description: description === null ? Prisma.DbNull : description,
        editedAt: new Date(),
      },
    });
  }),
});

export const DeckAddCardsMutation = mutationField("deckAddCards", {
  type: nonNull("Deck"),
  args: {
    deckId: nonNull(idArg()),
    cards: nonNull(list(nonNull("CardCreateInput"))),
  },
  resolve: guardValidUser(async (_root, { deckId, cards }, { prisma, sub }) => {
    const newCards = cards.map(({ prompt, fullAnswer, answers, template }) => ({
      prompt: prompt ?? Prisma.DbNull,
      fullAnswer: fullAnswer ?? Prisma.DbNull,
      answers,
      template: template ?? undefined,
    }));
    return prisma.deck.update({
      where: { id: deckId, ownerId: sub.id },
      data: {
        cards: {
          create: newCards,
        },
      },
    });
  }),
});

export const DeckAddSubdeckMutation = mutationField("deckAddSubdeck", {
  type: nonNull("Deck"),
  args: {
    id: nonNull(idArg()),
    subdeckId: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id, subdeckId }, { prisma, sub }) =>
    prisma.deck.update({
      where: { id, ownerId: sub.id },
      data: {
        parentDeckIn: {
          connectOrCreate: {
            where: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              parentDeckId_subdeckId: { parentDeckId: id, subdeckId },
              subdeck: { id: subdeckId, ownerId: sub.id },
            },
            create: {
              subdeck: { connect: { id: subdeckId, ownerId: sub.id } },
            },
          },
        },
      },
    })
  ),
});

export const DeckRemoveSubdeckMutation = mutationField("deckRemoveSubdeck", {
  type: nonNull("Deck"),
  args: {
    id: nonNull(idArg()),
    subdeckId: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id, subdeckId }, { prisma, sub }) =>
    prisma.deck.update({
      where: { id, ownerId: sub.id },
      data: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        parentDeckIn: {
          delete: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } },
        },
      },
    })
  ),
});

export const DeckDeleteMutation = mutationField("deckDelete", {
  type: nonNull("Deck"),
  args: {
    id: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id }, { prisma, sub }) =>
    prisma.deck.delete({ where: { id, ownerId: sub.id } })
  ),
});

export const OwnDeckRecordSetMutation = mutationField("ownDeckRecordSet", {
  type: nonNull("UserDeckRecord"),
  args: {
    deckId: nonNull(idArg()),
    notes: nonNull(jsonObjectArg()),
  },
  resolve: guardValidUser((_source, { deckId, notes }, { prisma, sub }) =>
    prisma.userDeckRecord.upsert({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { userId_deckId: { userId: sub.id, deckId } },
      create: {
        deck: { connect: { id: deckId } },
        user: { connect: { id: sub.id } },
        notes: notes as Prisma.InputJsonObject,
      },
      update: {
        notes: notes as Prisma.InputJsonObject,
      },
    })
  ),
});
