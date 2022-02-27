import type { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import { mutationDeckCreateEmpty, queryDeckScalars, queryDecks, testContextFactory } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { WrServer, graphQLServerFactory } from "../../../src/graphqlServer";
import { PubSub, YogaInitialContext, createPubSub } from "@graphql-yoga/node";
import { Context, PubSubPublishArgsByKey } from "../../../src/context";

export const DEFAULT_CURRENT_USER = {
	id: "fake-id",
	name: "fake-name",
	roles: [Roles.user],
};

describe("graphql/Deck.ts", () => {

	let setSub: (sub?: CurrentUser) => void;
	let context: (initialContext: YogaInitialContext) => Context;
	let stopContext: () => Promise<unknown>;
	let prisma: DeepMockProxy<PrismaClient>;
	let server: WrServer;
	let redis: DeepMockProxy<Redis.Redis>;
	let setPubsub: (pubsub: PubSub<PubSubPublishArgsByKey>) => void;

	// eslint-disable-next-line @typescript-eslint/require-await
	beforeAll(async () => {
		prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;
		redis = mockDeep<Redis.Redis>();
		[setSub, setPubsub, context, stopContext] = testContextFactory({
			prisma: prisma as unknown as PrismaClient,
			pubsub: createPubSub(),
			redis,
		});
		server = graphQLServerFactory(context);
	});

	afterAll(async () => {
		await Promise.allSettled([server.stop(), stopContext()]);
	});

	afterEach(() => {
		setSub();
		setPubsub(createPubSub());
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
				const { executionResult } = await mutationDeckCreateEmpty(server);
				expect(executionResult).toHaveProperty("data.deckCreate.id", id);
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
				const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const id = createDeckExecutionResult.data.deckCreate.id as string;
				const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
				expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
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
				const { executionResult: createDeck1ExecutionResult } = await mutationDeckCreateEmpty(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const id1 = createDeck1ExecutionResult.data.deckCreate.id as string;
				const { executionResult: createDeck2ExecutionResult } = await mutationDeckCreateEmpty(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const id2 = createDeck2ExecutionResult.data.deckCreate.id as string;
				const queryDecksRes = await queryDecks(server);
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
