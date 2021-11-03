import { Prisma, Unit } from "@prisma/client";
import { arg, booleanArg, inputObjectType, list, mutationField, nonNull, objectType, stringArg } from "nexus";
import { userLacksPermissionsErrorFactory } from "../error/userLacksPermissionsErrorFactory";
import { userNotLoggedInErrorFactory } from "../error/userNotLoggedInErrorFactory";
import { dateTimeArg, jsonObjectArg, uuidArg } from "./scalarUtil";

export const Card = objectType({
	name: "Card",
	definition(t) {
		t.nonNull.uuid("id");
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
		t.nonNull.string("sortKey");
		t.nonNull.boolean("template");
		t.nonNull.boolean("mainTemplate", {
			resolve({ default: isDefault }) {
				return isDefault === Unit.UNIT;
			},
		});
		t.nonNull.dateTime("editedAt");

		t.field("ownRecord", {
			type: "UserCardRecord",
			async resolve({ id: cardId }, _args, { sub, prisma }) {
				if (!sub) {
					throw userNotLoggedInErrorFactory();
				}
				// eslint-disable-next-line @typescript-eslint/naming-convention
				return prisma.userCardRecord.findUnique({ where: { userId_cardId: { userId: sub.id, cardId } } });
			},
		});
	},
});

export const UserCardRecord = objectType({
	name: "UserCardRecord",
	definition(t) {
		t.nonNull.uuid("userId");
		t.nonNull.uuid("cardId");
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
		deckId: uuidArg(),
		/*
		 * note that template is set to true if mainTemplate
		 * is set to true and template is unspecified
		 */
		card: nonNull(arg({
			type: "CardCreateInput",
		})),
		mainTemplate: booleanArg({ undefinedOnly: true }),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const CardCreateInput = inputObjectType({
	name: "CardCreateInput",
	definition(t) {
		t.nonNull.jsonObject("prompt");
		t.nonNull.jsonObject("fullAnswer");
		t.nonNull.list.nonNull.string("answers");
		t.string("sortKey", { undefinedOnly: true });
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
		id: nonNull(uuidArg()),
		prompt: jsonObjectArg({ undefinedOnly: true }),
		fullAnswer: jsonObjectArg({ undefinedOnly: true }),
		answers: list(nonNull(stringArg({ undefinedOnly: true }))),
		sortKey: stringArg({ undefinedOnly: true }),
		template: booleanArg({ undefinedOnly: true }),
		/*
		 * note that template is set to true if mainTemplate
		 * is set to true and template is unspecified
		 */
		mainTemplate: booleanArg({ undefinedOnly: true }),
	},
	async resolve(_source, { id, prompt, fullAnswer, answers, sortKey, template }, { sub, prisma }) {
		if (!sub) {
			throw userNotLoggedInErrorFactory();
		}
		const updated = await prisma.card.updateMany({
			where: {
				id,
				deck: {
					ownerId: sub.id,
				},
			},
			data: {
				prompt: prompt ? JSON.stringify(prompt) : undefined,
				fullAnswer: fullAnswer ? JSON.stringify(fullAnswer) : undefined,
				answers: answers ? { set: answers } : undefined,
				sortKey: sortKey ?? undefined,
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
	},
});

export const CardUnsetMainTemplateMutation = mutationField("cardUnsetMainTemplate", {
	type: "Card",
	args: {
		deckId: nonNull(uuidArg()),
	},
	async resolve(_source, { deckId }, { sub, prisma }) {
		if (!sub) {
			throw userNotLoggedInErrorFactory();
		}
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
	},
});

export const CardDeleteMutation = mutationField("cardDelete", {
	type: nonNull("Card"),
	args: {
		id: nonNull(uuidArg()),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const OwnCardRecordSetMutation = mutationField("ownCardRecordSet", {
	type: "UserCardRecord",
	args: {
		cardId: nonNull(uuidArg()),
		correctRecordAppend: nonNull(list(nonNull(dateTimeArg()))),
	},
});
