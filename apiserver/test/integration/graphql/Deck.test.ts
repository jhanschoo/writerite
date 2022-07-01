import type { PrismaClient } from "@prisma/client";

import { cascadingDelete } from "../_helpers/truncate";
import { loginAsNewlyCreatedUser } from "../../helpers/graphql/User.util";
import { isoTimestampMatcher, mutationDeckCreateEmpty, queryDeckScalars, queryDecks, testContextFactory } from "../../helpers";
import type { CurrentUser } from "../../../src/types";
import { YogaInitialContext } from "@graphql-yoga/node";
import { Context } from "../../../src/context";
import { WrServer, graphQLServerFactory } from "../../../src/graphqlServer";

describe("graphql/Deck.ts", () => {

	let setSub: (sub?: CurrentUser) => void;
	let context: (initialContext: YogaInitialContext) => Context;
	let stopContext: () => Promise<unknown>;
	let prisma: PrismaClient;
	let server: WrServer;

	beforeAll(() => {
		[setSub, , context, stopContext, { prisma }] = testContextFactory();
		server = graphQLServerFactory({ context });
	});

	afterAll(async () => {
		await cascadingDelete(prisma).user;
		await Promise.allSettled([server.stop(), stopContext()]);
	});

	afterEach(async () => {
		await cascadingDelete(prisma).user;
	});

	describe("Mutation", () => {
		describe("deckAddSubdeck", () => {
			// TODO: implement
		});
		describe("deckCreate", () => {
			it("should be able to create an empty deck", async () => {
				expect.assertions(1);
				await loginAsNewlyCreatedUser(server, setSub);
				const { executionResult } = await mutationDeckCreateEmpty(server);
				expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
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

	describe("Query", () => {
		describe("deck", () => {
			it("should be able to return scalars of an owned deck", async () => {
				expect.assertions(1);
				const currentUser = await loginAsNewlyCreatedUser(server, setSub);
				const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const { id } = createDeckExecutionResult!.data!.deckCreate;
				const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
				expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
					id,
					answerLang: "",
					archived: false,
					description: {},
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					editedAt: expect.stringMatching(isoTimestampMatcher),
					name: "",
					ownerId: currentUser.id,
					promptLang: "",
					published: false,
					sortData: [],
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					usedAt: expect.stringMatching(isoTimestampMatcher),
				});
			});
		});

		describe("decks", () => {
			it("should be able to return ids of owned, unarchived decks", async () => {
				expect.assertions(1);
				await loginAsNewlyCreatedUser(server, setSub);
				const { executionResult: createDeck1ExecutionResult } = await mutationDeckCreateEmpty(server);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const id1 = createDeck1ExecutionResult!.data!.deckCreate.id;
				const { executionResult: createDeck2ExecutionResult } = await mutationDeckCreateEmpty(server);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const id2 = createDeck2ExecutionResult!.data!.deckCreate.id;
				const { executionResult: queryDeckExecutionResult } = await queryDecks(server);
				expect(queryDeckExecutionResult).toHaveProperty("data.decks", expect.arrayContaining([
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
