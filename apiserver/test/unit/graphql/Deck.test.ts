import type { ContextFunction } from "apollo-server-core";
import type { ApolloServer } from "apollo-server-koa";
import type { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PubSub, PubSubEngine } from "graphql-subscriptions";
import Redis from "ioredis";

import { apolloFactory } from "../../../src/apollo";
import { mutationDeckCreateEmpty, queryDeckScalars, queryDecks, testContextFactory } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";

export const DEFAULT_CURRENT_USER = {
	id: "fake-id",
	email: "abc@xyz.com",
	name: null,
	roles: [Roles.user],
};

describe("graphql/Deck.ts", () => {

	let setSub: (sub?: CurrentUser) => void;
	let context: ContextFunction;
	let stopContext: () => Promise<unknown>;
	let prisma: DeepMockProxy<PrismaClient>;
	let apollo: ApolloServer;
	let redis: DeepMockProxy<Redis.Redis>;
	let setPubsub: (pubsub: PubSubEngine) => void;

	// eslint-disable-next-line @typescript-eslint/require-await
	beforeAll(async () => {
		prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;
		redis = mockDeep<Redis.Redis>();
		[setSub, setPubsub, context, stopContext] = testContextFactory({
			prisma: prisma as unknown as PrismaClient,
			pubsub: new PubSub(),
			redis,
		});
		apollo = apolloFactory(context);
	});

	afterAll(async () => {
		await Promise.allSettled([apollo.stop(), stopContext()]);
	});

	afterEach(() => {
		setSub();
		setPubsub(new PubSub());
		mockReset(prisma);
		mockReset(redis);
	});

	describe("Mutation", () => {
		describe("deckAddSubdeck", () => {
			// TODO: implement
		});
		describe("deckCreate", () => {
			it("should be able to create an empty deck", async () => {
				expect.assertions(1);
				setSub(DEFAULT_CURRENT_USER);
				const id = "fake-id";
				// @ts-expect-error dumb default type resolution error
				prisma.deck.create.mockReturnValue(Promise.resolve({
					id,
				}));
				const createDeckRes = await mutationDeckCreateEmpty(apollo);
				expect(createDeckRes).toHaveProperty("data.deckCreate.id", id);
			});
		});
		describe("deckDelete", () => {
			// TODO: implement
		});
		describe("deckEdit", () => {
			// TODO: implement
		});
		describe("deckRemoveSubdeck", () => {
			// TODO: implement
		});
		describe("deckUsed", () => {
			// TODO: implement
		});
	});

	describe.skip("Query", () => {
		describe("deck", () => {
			it("should be able to return scalars of an owned deck", async () => {
				expect.assertions(1);
				setSub(DEFAULT_CURRENT_USER);
				const createDeckRes = await mutationDeckCreateEmpty(apollo);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const id = createDeckRes.data?.deckCreate?.id as string;
				const queryDeckRes = await queryDeckScalars(apollo, id);
				expect(queryDeckRes).toHaveProperty("data.deck", {
					id,
					answerLang: "",
					archived: false,
					description: {},
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					editedAt: expect.any(Date),
					name: "",
					ownerId: DEFAULT_CURRENT_USER.id,
					promptLang: "",
					published: false,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					usedAt: expect.any(Date),
				});
			});
		});

		describe("decks", () => {
			it("should be able to return ids of owned, unarchived decks", async () => {
				expect.assertions(1);
				setSub(DEFAULT_CURRENT_USER);
				const createDeck1Res = await mutationDeckCreateEmpty(apollo);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const id1 = createDeck1Res.data?.deckCreate?.id as string;
				const createDeck2Res = await mutationDeckCreateEmpty(apollo);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const id2 = createDeck2Res.data?.deckCreate?.id as string;
				const queryDecksRes = await queryDecks(apollo);
				expect(queryDecksRes).toHaveProperty("data.decks", expect.arrayContaining([
					{
						id: id1,
					},
					{
						id: id2,
					},
				]));
			});
		});
	});
});
