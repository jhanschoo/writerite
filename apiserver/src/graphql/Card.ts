import { Prisma, Unit } from "@prisma/client";
import { arg, booleanArg, idArg, inputObjectType, list, mutationField, nonNull, objectType, stringArg } from "nexus";
import { userLacksPermissionsErrorFactory } from "../error/userLacksPermissionsErrorFactory";
import { guardValidUser } from "../service/authorization/guardValidUser";
import { dateTimeArg, jsonObjectArg } from "./scalarUtil";

export const Card = objectType({
  name: "Card",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.jsonObject("prompt", {
      resolve({ prompt }) {
        return prompt as Prisma.JsonObject;
      },
    });
    t.nonNull.jsonObject("fullAnswer", {
      resolve({ fullAnswer }) {
        return fullAnswer as Prisma.JsonObject;
      },
    });
    t.nonNull.list.nonNull.string("answers");
    t.nonNull.boolean("template");
    t.nonNull.boolean("mainTemplate", {
      resolve({ default: isDefault }) {
        return isDefault === Unit.UNIT;
      },
    });
    t.nonNull.dateTime("editedAt");

    t.field("ownRecord", {
      type: "UserCardRecord",
      resolve: guardValidUser(async ({ id: cardId }, _args, { sub, prisma }) =>
        // eslint-disable-next-line @typescript-eslint/naming-convention
        prisma.userCardRecord.findUnique({ where: { userId_cardId: { userId: sub.id, cardId } } })),
    });
  },
});

export const UserCardRecord = objectType({
  name: "UserCardRecord",
  definition(t) {
    t.nonNull.list.nonNull.dateTime("correctRecord");
  },
});

export const CardCreateMutation = mutationField("cardCreate", {
  /*
   * Note:
   * clients should infer that the mainTemplate field of another card
   * becomes unset (if it does) from the mainTemplate field from
   * the returned card becoming set
   */
  type: nonNull("Card"),
  args: {
    deckId: nonNull(idArg()),
    /*
     * note that template is set to true if mainTemplate
     * is set to true and template is unspecified
     */
    card: nonNull("CardCreateInput"),
    mainTemplate: booleanArg({ undefinedOnly: true }),
  },
  resolve: guardValidUser(async (_source, { deckId, card, mainTemplate }, { prisma, sub }) => {
    const { prompt, fullAnswer, answers, template } = card;
    if (await prisma.deck.count({ where: { id: deckId, ownerId: sub.id } }) !== 1) {
      throw userLacksPermissionsErrorFactory();
    }
    if (mainTemplate) {
      await prisma.card.updateMany({
        where: {
          deckId,
          default: Unit.UNIT,
        },
        data: {
          default: null,
        },
      });
    }
    return prisma.card.create({
      data: {
        prompt: prompt as Prisma.InputJsonObject,
        fullAnswer: fullAnswer as Prisma.InputJsonObject,
        answers,
        template: template ?? undefined,
        default: mainTemplate ? Unit.UNIT : undefined,
        deck: { connect: { id: deckId } },
      },
    });
  }),
});

export const CardCreateInput = inputObjectType({
  name: "CardCreateInput",
  definition(t) {
    t.nonNull.jsonObject("prompt");
    t.nonNull.jsonObject("fullAnswer");
    t.nonNull.list.nonNull.string("answers");
    t.boolean("template", { undefinedOnly: true });
  },
});

export const CardEditMutation = mutationField("cardEdit", {
  /*
   * Note:
   * clients should infer that the mainTemplate field of another card
   * becomes unset (if it does) from the mainTemplate field from
   * the returned card becoming set
   */
  type: nonNull("Card"),
  args: {
    id: nonNull(idArg()),
    prompt: jsonObjectArg({ undefinedOnly: true }),
    fullAnswer: jsonObjectArg({ undefinedOnly: true }),
    answers: list(nonNull(stringArg({ undefinedOnly: true }))),
    template: booleanArg({ undefinedOnly: true }),
    /*
     * note that template is set to true if mainTemplate
     * is set to true and template is unspecified
     */
    mainTemplate: booleanArg({ undefinedOnly: true }),
  },
  resolve: guardValidUser(async (_source, { id, prompt, fullAnswer, answers, template }, { sub, prisma }) => {
    const updated = await prisma.card.updateMany({
      where: {
        id,
        deck: {
          ownerId: sub.id,
        },
      },
      data: {
        prompt: (prompt ?? undefined) as Prisma.InputJsonObject | undefined,
        fullAnswer: (fullAnswer ?? undefined) as Prisma.InputJsonObject | undefined,
        answers: answers ? { set: answers } : undefined,
        template: template ?? undefined,
      },
    });
    if (updated.count !== 1) {
      throw userLacksPermissionsErrorFactory();
    }
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw userLacksPermissionsErrorFactory();
    }
    return card;
  }),
});

export const CardUnsetMainTemplateMutation = mutationField("cardUnsetMainTemplate", {
  type: "Card",
  args: {
    deckId: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { deckId }, { sub, prisma }) => {
    const whereDeck = {
      id: deckId,
      ownerId: sub.id,
    };
    const card = await prisma.card.findFirst({ where: { deck: whereDeck, default: Unit.UNIT } });
    if (!card) {
      return null;
    }
    const { id } = card;
    const updated = await prisma.card.updateMany({
      where: {
        id,
        deck: whereDeck,
        default: Unit.UNIT,
      },
      data: {
        default: null,
      },
    });
    if (updated.count !== 1) {
      throw userLacksPermissionsErrorFactory();
    }
    return prisma.card.findUnique({ where: { id: card.id } });
  }),
});

export const CardDeleteMutation = mutationField("cardDelete", {
  type: nonNull("Card"),
  args: {
    id: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_source, { id }, { sub, prisma }) => {
    const cards = await prisma.card.findMany({
      where: {
        id,
        deck: {
          ownerId: sub.id,
        },
      },
    });
    if (cards.length !== 1) {
      throw userLacksPermissionsErrorFactory();
    }
    const [card] = cards;
    const res = await prisma.card.deleteMany({
      where: {
        id,
        deck: {
          ownerId: sub.id,
        },
      },
    });
    if (res.count !== 1) {
      throw userLacksPermissionsErrorFactory();
    }
    return card;
  }),
});

export const OwnCardRecordSetMutation = mutationField("ownCardRecordSet", {
  type: "UserCardRecord",
  args: {
    cardId: nonNull(idArg()),
    correctRecordAppend: nonNull(list(nonNull(dateTimeArg()))),
  },
  resolve: guardValidUser((_source, { cardId, correctRecordAppend }, { sub, prisma }) => prisma.userCardRecord.upsert({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { userId_cardId: { userId: sub.id, cardId } },
    create: {
      card: { connect: { id: cardId } },
      user: { connect: { id: sub.id } },
      correctRecord: { set: correctRecordAppend },
    },
    update: {
      correctRecord: { push: correctRecordAppend },
    },
  })),
});
