import { Prisma, Unit } from "@prisma/client";
import { builder } from "../builder";
import { CardInput } from "./inputs/CardInput";
import { decodeGlobalID } from "@pothos/plugin-relay";

/**
 * Cards have no access control, and they must not naively appear top-level.
 */
export const Card = builder.prismaNode("Card", {
  authScopes: {
    authenticated: true,
  },
  id: { field: "id" },
  fields: (t) => ({
    prompt: t.field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ prompt }) => prompt as Prisma.JsonObject | null,
    }),
    fullAnswer: t.field({
      type: "JSONObject",
      nullable: true,
      resolve: ({ fullAnswer }) => fullAnswer as Prisma.JsonObject | null,
    }),
    answers: t.exposeStringList("answers"),
    isTemplate: t.exposeBoolean("isTemplate"),
    isPrimaryTemplate: t.field({
      type: "Boolean",
      resolve: ({ isPrimaryTemplate }) => {
        return Boolean(isPrimaryTemplate);
      },
    }),
    editedAt: t.expose("editedAt", { type: "DateTime" }),
    // ID's if revealed, need to be converted to global IDs
    // deckId: t.exposeID("deckId"),
    ownRecordCorrectHistory: t.field({
      type: ["DateTime"],
      nullable: true,
      select: (_args, { sub }) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        records: {
          where: { userId: sub!.id },
          select: { correctRecord: true },
        },
      }),
      resolve: ({ records }) => {
        return (
          (records[0] as { correctRecord: Date[] } | undefined)
            ?.correctRecord ?? null
        );
      },
    }),
  }),
});

builder.mutationFields((t) => ({
  cardCreate: t.withAuth({ authenticated: true }).prismaField({
    type: Card,
    args: {
      deckId: t.arg.id({ required: true }),
      card: t.arg({ type: CardInput, required: true }),
      isPrimaryTemplate: t.arg.boolean(),
    },
    resolve: async (
      query,
      _root,
      { deckId, card, isPrimaryTemplate },
      { prisma, sub }
    ) => {
      deckId = decodeGlobalID(deckId as string).id;
      const deckConditions = { id: deckId, ownerId: sub.id };
      const updateDeckOperation = () =>
        prisma.deck.update({
          where: deckConditions,
          data: { editedAt: new Date() },
        });
      const cardCreateOperation = (isPrimaryTemplate: Unit | null) =>
        prisma.card.create({
          ...query,
          data: {
            prompt: card.prompt,
            fullAnswer: card.fullAnswer,
            answers: card.answers,
            isTemplate: card.isTemplate,
            isPrimaryTemplate,
            deck: {
              connect: deckConditions,
            },
          },
        });
      if (isPrimaryTemplate) {
        const res = await prisma.$transaction([
          updateDeckOperation(),
          prisma.card.updateMany({
            where: { deck: deckConditions, isPrimaryTemplate: Unit.UNIT },
            data: { isPrimaryTemplate: null },
          }),
          cardCreateOperation(Unit.UNIT),
        ]);
        return res[2];
      } else {
        const res = await prisma.$transaction([
          updateDeckOperation(),
          cardCreateOperation(null),
        ]);
        return res[1];
      }
    },
  }),
  cardEdit: t.withAuth({ authenticated: true }).prismaField({
    type: Card,
    args: {
      id: t.arg.id({ required: true }),
      cardInput: t.arg({ type: CardInput }),
      isPrimaryTemplate: t.arg.boolean(),
    },
    resolve: async (
      query,
      _root,
      { id, cardInput, isPrimaryTemplate },
      { prisma, sub }
    ) => {
      id = decodeGlobalID(id as string).id;
      const cardConditions = { id, deck: { ownerId: sub.id } };
      const cardSetOperation = (isPrimaryTemplate: Unit | null) =>
        prisma.card.update({
          ...query,
          where: cardConditions,
          data: {
            ...cardInput,
            isPrimaryTemplate,
            deck: {
              update: { editedAt: new Date() },
            },
          },
        });
      if (isPrimaryTemplate) {
        const res = await prisma.$transaction([
          prisma.card.updateMany({
            where: { deck: { ownerId: sub.id }, isPrimaryTemplate: Unit.UNIT },
            data: { isPrimaryTemplate: null },
          }),
          cardSetOperation(Unit.UNIT),
        ]);
        return res[1];
      } else {
        return cardSetOperation(null);
      }
    },
  }),
  cardDelete: t.withAuth({ authenticated: true }).prismaField({
    type: Card,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, { prisma, sub }) => {
      id = decodeGlobalID(id as string).id;
      const cardConditions = { id, deck: { ownerId: sub.id } };
      const res = await prisma.$transaction([
        prisma.card.update({
          where: cardConditions,
          data: { deck: { update: { editedAt: new Date() } } },
        }),
        prisma.card.delete({
          ...query,
          where: cardConditions,
        }),
      ]);
      return res[0];
    },
  }),
  recordCorrectAnswer: t.withAuth({ authenticated: true }).prismaField({
    type: Card,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, { prisma, sub }) => {
      id = decodeGlobalID(id as string).id;
      const res = await prisma.card.update({
        ...query,
        where: { id },
        data: {
          records: {
            upsert: {
              where: {
                userId_cardId: { userId: sub.id, cardId: id },
              },
              update: { correctHistory: { push: new Date() } },
              create: { userId: sub.id, correctHistory: { set: [new Date()] } },
            },
          },
        },
      });
      return res;
    },
  }),
}));
