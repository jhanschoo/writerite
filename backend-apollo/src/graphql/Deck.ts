import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { arg, booleanArg, enumType, intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from "nexus";
import { getDescendantsOfDeck } from "../service/deckFamily";
import { jsonObjectArg, uuidArg } from "./scalarUtil";

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
		t.nonNull.uuid("id");
		t.nonNull.uuid("ownerId");
		t.nonNull.string("name");
		t.nonNull.jsonObject("description", {
			resolve({ description }) {
				return description as Prisma.JsonObject;
			},
		});
		t.nonNull.string("promptLang");
		t.nonNull.string("answerLang");
		t.nonNull.boolean("published");
		t.nonNull.boolean("archived");
		t.nonNull.dateTime("editedAt");
		t.nonNull.dateTime("usedAt");

		t.nonNull.field("owner", {
			type: "User",
			async resolve({ ownerId: id }, _args, { prisma }) {
				const user = await prisma.user.findUnique({ where: { id } });
				if (!user) {
					throw new ForbiddenError("No User that you are authorized to view");
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
		t.nonNull.uuid("userId");
		t.nonNull.uuid("deckId");
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
		id: nonNull(uuidArg()),
	},
	async resolve(_root, { id }, { prisma, sub }) {
		if (!sub) {
			throw new AuthenticationError("You need to be logged in");
		}
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
			throw new ForbiddenError("If such a deck exists, you are not authorized to view it");
		}
		return decks[0];
	},
});

export const DecksQuery = queryField("decks", {
	type: nonNull(list(nonNull("Deck"))),
	args: {
		cursor: uuidArg({ undefinedOnly: true }),
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
	async resolve(_root, { cursor, take, titleFilter, scope }, { sub, prisma }, _info) {
		if (!sub) {
			throw new AuthenticationError("You need to be logged in");
		}
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
	},
});

export const DecksQueryScope = enumType({
	name: "DecksQueryScope",
	members: ["UNARCHIVED", "OWNED", "PARTICIPATED", "VISIBLE"],
});

export const OwnDeckRecordQuery = queryField("ownDeckRecord", {
	type: "UserDeckRecord",
	args: {
		deckId: nonNull(uuidArg()),
	},
	async resolve(_root, { deckId }, { sub, prisma }) {
		if (!sub) {
			throw new AuthenticationError("You need to be logged in.");
		}
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return prisma.userDeckRecord.findUnique({ where: { userId_deckId: { userId: sub.id, deckId } } });
	},
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
	async resolve(_root, { name, description, promptLang, answerLang, published, archived, cards }, { sub, prisma }) {
		if (!sub) {
			throw new AuthenticationError("You need to be logged in");
		}
		return prisma.deck.create({ data: {
			ownerId: sub.id,
			name: name ?? "",
			description: (description ?? {}) as Prisma.InputJsonObject,
			promptLang: promptLang ?? "",
			answerLang: answerLang ?? "",
			published: published ?? true,
			archived: archived ?? false,
			cards: cards ? {
				create: cards,
			} : undefined,
		} });
	},
});

export const DeckEditMutation = mutationField("deckEdit", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(uuidArg()),
		name: stringArg({ undefinedOnly: true }),
		description: jsonObjectArg({ undefinedOnly: true }),
		promptLang: stringArg({ undefinedOnly: true }),
		answerLang: stringArg({ undefinedOnly: true }),
		published: booleanArg({ undefinedOnly: true }),
		archived: booleanArg({ undefinedOnly: true }),
	},
	async resolve(_root, { id, name, description, promptLang, answerLang, published, archived }, { sub, prisma }) {
		if (!sub) {
			throw new AuthenticationError("You need to be logged in");
		}
		const { count } = await prisma.deck.updateMany({ where: { id, ownerId: sub.id }, data: {
			name: name as string | undefined,
			description: description as Prisma.InputJsonObject | undefined,
			promptLang: promptLang as string | undefined,
			answerLang: answerLang as string | undefined,
			published: published as boolean | undefined,
			archived: archived as boolean | undefined,
		} });
		if (count === 1) {
			const deck = await prisma.deck.findUnique({ where: { id } });
			if (!deck) {
				throw new ApolloError("");
			}
		}
		throw new ApolloError("");
	},
});

export const DeckAddSubdeckMutation = mutationField("deckAddSubdeck", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(uuidArg()),
		subdeckId: nonNull(uuidArg()),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const DeckRemoveSubdeckMutation = mutationField("deckRemoveSubdeck", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(uuidArg()),
		subdeckId: nonNull(uuidArg()),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const DeckUsedMutation = mutationField("deckUsed", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(uuidArg()),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const DeckDeleteMutation = mutationField("deckDelete", {
	type: nonNull("Deck"),
	args: {
		id: nonNull(uuidArg()),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const OwnDeckRecordSetMutation = mutationField("ownDeckRecordSet", {
	type: nonNull("UserDeckRecord"),
	args: {
		deckId: nonNull(uuidArg()),
		notes: nonNull(jsonObjectArg()),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});