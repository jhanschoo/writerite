import { Prisma } from "@prisma/client";
import cuid from "cuid";
import { arg, booleanArg, enumType, idArg, intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from "nexus";
import { userLacksPermissionsErrorFactory } from "../error/userLacksPermissionsErrorFactory";
import { guardValidUser } from "../service/authorization/guardValidUser";
import { getDescendantsOfDeck } from "../service/deckFamily";
import { jsonObjectArg } from "./scalarUtil";
import * as yup from 'yup';

const DEFAULT_TAKE = 60;

function cursorParams(cursor?: string | null, take?: number | null): {
	cursor: { id: string },
	skip: number,
	take: number,
} | {
	take: number
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

export const Deck = objectType({
	name: "Deck",
	definition(t) {
		t.nonNull.id("id");
		t.nonNull.id("ownerId");
		t.nonNull.string("name");
		t.nonNull.jsonObject("description", {
			resolve({ description }) {
				return description as Prisma.InputJsonObject;
			},
		});
		t.nonNull.string("promptLang");
		t.nonNull.string("answerLang");
		t.nonNull.boolean("published");
		t.nonNull.boolean("archived");
		t.nonNull.list.nonNull.string("sortData");
		t.nonNull.dateTime("editedAt");
		t.nonNull.dateTime("usedAt");

		t.nonNull.field("owner", {
			type: "User",
			async resolve({ ownerId: id }, _args, { prisma }) {
				const user = await prisma.user.findUnique({ where: { id } });
				if (!user) {
					throw userLacksPermissionsErrorFactory("If such a user exists, you are not authorized to view it");
				}
				return user;
			},
		});
		t.nonNull.list.nonNull.field("subdecks", {
			type: "Deck",
			description: "all direct subdecks of this deck",
			async resolve({ id: parentDeckId }, _args, { prisma }) {
				return prisma.deck.findMany({ where: { parentDecks: { some: { parentDeckId } } } });
			},
		});
		t.nonNull.list.nonNull.field("descendantDecks", {
			type: "Deck",
			description: "all descendant (reflexive, transitive closure of subdeck) decks of this deck",
			async resolve({ id }, _args, { prisma }) {
				return getDescendantsOfDeck(prisma, id);
			},
		});
		t.nonNull.list.nonNull.field("cardsDirect", {
			type: "Card",
			description: "all cards directly belonging to this deck",
			async resolve({ id: deckId }, _args, { prisma }) {
				return prisma.card.findMany({ where: { deckId } });
			},
		});
		t.nonNull.list.nonNull.field("cardsAllUnder", {
			type: "Card",
			description: "all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck",
			async resolve({ id }, _args, { prisma }) {
				const decks = await getDescendantsOfDeck(prisma, id);
				// eslint-disable-next-line @typescript-eslint/no-shadow
				return prisma.card.findMany({ where: { deckId: { in: decks.map(({ id }) => id) } } });
			},
		});
		t.field("ownRecord", {
			type: "UserDeckRecord",
			async resolve({ id: deckId }, _args, { prisma, sub }) {
				if (!sub) {
					return null;
				}
				// eslint-disable-next-line @typescript-eslint/naming-convention
				return prisma.userDeckRecord.findUnique({ where: { userId_deckId: { userId: sub.id, deckId } } });
			},
		});
	},
});

export const UserDeckRecord = objectType({
	name: "UserDeckRecord",
	definition(t) {
		t.nonNull.jsonObject("notes", {
			resolve({ notes }) {
				return notes as Prisma.JsonObject;
			},
		});
	},
});

export const DeckQuery = queryField("deck", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(idArg()),
	},
	resolve: guardValidUser(async (_root, { id }, { prisma, sub }) => {
		const OR = [
			{ ownerId: sub.id },
			{ cards: { some: { records: { some: { userId: sub.id } } } } },
			{ published: true },
		];
		const decks = await prisma.deck.findMany({ where: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			OR, id,
		} });
		if (decks.length === 0) {
			throw userLacksPermissionsErrorFactory("If such a deck exists, you are not authorized to view it");
		}
		return decks[0];
	}),
});

export const DecksQuery = queryField("decks", {
	type: nonNull(list(nonNull("Deck"))),
	args: {
		cursor: idArg({ undefinedOnly: true }),
		take: intArg({ undefinedOnly: true }),
		titleFilter: stringArg({ undefinedOnly: true }),
		scope: arg({
			type: "DecksQueryScope",
			undefinedOnly: true,
		}),
	},
	description: `\
	implicit limit of 60
	`,
	resolve: guardValidUser(async (_root, { cursor, take, titleFilter, scope }, { sub, prisma }, _info) => {
		const OR = [
			{ ownerId: sub.id, archived: scope === "UNARCHIVED" ? false : undefined },
			{ cards: { some: { records: { some: { userId: sub.id } } } } },
			{ published: true },
		];
		switch (scope) {
			case "PARTICIPATED":
				OR.length = 3;
				break;
			case "VISIBLE":
				OR.length = 2;
				break;
			case "OWNED":
				// falls through
			case "UNARCHIVED":
				// falls through
			default:
				OR.length = 1;
		}
		const decks = await prisma.deck.findMany({
			...cursorParams(cursor, take),
			where: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				OR,
				name: titleFilter ? {
					contains: titleFilter,
				} : undefined,
			},
			include: {
				owner: true,
				cards: true,
			},
		});
		return decks;
	}),
});

export const DecksQueryScope = enumType({
	name: "DecksQueryScope",
	members: ["UNARCHIVED", "OWNED", "PARTICIPATED", "VISIBLE"],
});

export const OwnDeckRecordQuery = queryField("ownDeckRecord", {
	type: "UserDeckRecord",
	args: {
		deckId: nonNull(idArg()),
	},
	resolve: guardValidUser(async (_root, { deckId }, { sub, prisma }) =>
		// eslint-disable-next-line @typescript-eslint/naming-convention
		prisma.userDeckRecord.findUnique({ where: { userId_deckId: { userId: sub.id, deckId } } })),
});

export const deckCreateSchema = yup.object({
	name: yup.string().trim(),
	description: yup.object(),
	promptLang: yup.string().trim().min(2),
	answerLang: yup.string().trim().min(2),
	published: yup.boolean(),
	archived: yup.boolean(),
	cards: yup.array(yup.object({
		answers: yup.array(yup.string()).required(),
		fullAnswer: yup.object().required(),
		prompt: yup.object().required(),
		template: yup.boolean(),
	})),
});
export const DeckCreateMutation = mutationField("deckCreate", {
	type: nonNull("Deck"),
	args: {
		name: stringArg({ undefinedOnly: true }),
		description: jsonObjectArg({ undefinedOnly: true }),
		promptLang: stringArg({ undefinedOnly: true }),
		answerLang: stringArg({ undefinedOnly: true }),
		published: booleanArg({ undefinedOnly: true }),
		archived: booleanArg({ undefinedOnly: true }),
		cards: list(nonNull(arg({
			type: "CardCreateInput",
			undefinedOnly: true,
		}))),
	},
	resolve: guardValidUser(async (_root, args, { sub, prisma }) => {
		const { cards, ...rest } = await deckCreateSchema.validate(args);
		const cardsWithId = cards?.map((card) => ({ id: cuid(), ...card }));
		const sortData = cardsWithId?.map(({ id }) => id);

		return prisma.deck.create({ data: {
			ownerId: sub.id,
			...rest,
			cards: cardsWithId ? { create: cardsWithId } : undefined,
			sortData,
		} });
	}),
});

export const deckEditSchema = yup.object({
	id: yup.string().min(20).required(),
	name: yup.string().trim(),
	description: yup.object(),
	promptLang: yup.string().trim().min(2),
	answerLang: yup.string().trim().min(2),
	published: yup.boolean(),
	archived: yup.boolean(),
});
export const DeckEditMutation = mutationField("deckEdit", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(idArg()),
		name: stringArg({ undefinedOnly: true }),
		description: jsonObjectArg({ undefinedOnly: true }),
		promptLang: stringArg({ undefinedOnly: true }),
		answerLang: stringArg({ undefinedOnly: true }),
		published: booleanArg({ undefinedOnly: true }),
		archived: booleanArg({ undefinedOnly: true }),
	},
	resolve: guardValidUser(async (_root, args, { sub, prisma }) => {
		const { id, ...data } = await deckEditSchema.validate(args);
		const { count } = await prisma.deck.updateMany({ where: { id, ownerId: sub.id }, data: { ...data, editedAt: new Date() } });
		if (count !== 1) {
			throw new Error("");
		}
		const deck = await prisma.deck.findUnique({ where: { id } });
		if (!deck) {
			throw new Error("");
		}
		return deck;
	}),
});

export const DeckAddSubdeckMutation = mutationField("deckAddSubdeck", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(idArg()),
		subdeckId: nonNull(idArg()),
	},
	resolve: guardValidUser(async (_source, { id, subdeckId }, { sub, prisma }) => {
		if (await prisma.deck.count({
			where: {
				ownerId: sub.id,
				id: { in: [id, subdeckId] },
			},
		}) !== 2) {
			throw userLacksPermissionsErrorFactory();
		}
		return prisma.deck.update({
			where: { id },
			data: {
				subdecks: { connectOrCreate: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					where: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } },
					create: { subdeck: { connect: { id: subdeckId } } },
				} },
			},
		});
	}),
});

export const DeckRemoveSubdeckMutation = mutationField("deckRemoveSubdeck", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(idArg()),
		subdeckId: nonNull(idArg()),
	},
	resolve: guardValidUser(async (_source, { id, subdeckId }, { sub, prisma }) => {
		if (await prisma.deck.count({
			where: {
				ownerId: sub.id,
				id: { in: [id, subdeckId] },
			},
		}) !== 2) {
			throw userLacksPermissionsErrorFactory();
		}
		return prisma.deck.update({
			where: { id },
			data: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				subdecks: { delete: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } } },
			},
		});
	}),
});

export const DeckUsedMutation = mutationField("deckUsed", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(idArg()),
	},
	resolve: guardValidUser(async (_source, { id }, { sub, prisma }) => {
		if (await prisma.deck.count({ where: { ownerId: sub.id, id } }) !== 1) {
			throw userLacksPermissionsErrorFactory();
		}
		return prisma.deck.update({
			where: { id },
			data: {
				usedAt: new Date(),
			},
		});
	}),
});

export const DeckDeleteMutation = mutationField("deckDelete", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(idArg()),
	},
	resolve: guardValidUser(async (_source, { id }, { sub, prisma }) => {
		const decks = await prisma.deck.findMany({ where: { id, ownerId: sub.id } });
		if (decks.length !== 1) {
			throw userLacksPermissionsErrorFactory();
		}
		const [deck] = decks;
		const res = await prisma.deck.deleteMany({
			where: { id, ownerId: sub.id },
		});
		if (res.count !== 1) {
			throw userLacksPermissionsErrorFactory();
		}
		return deck;
	}),
});

export const OwnDeckRecordSetMutation = mutationField("ownDeckRecordSet", {
	type: nonNull("UserDeckRecord"),
	args: {
		deckId: nonNull(idArg()),
		notes: nonNull(jsonObjectArg()),
	},
	resolve: guardValidUser((_source, { deckId, notes }, { sub, prisma }) => prisma.userDeckRecord.upsert({
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
	})),
});
