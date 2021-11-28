import type { ContextFunction } from "apollo-server-core";
import type { ApolloServer } from "apollo-server-koa";
import type { PrismaClient } from "@prisma/client";

import { apolloFactory } from "../../../src/apollo";
import { cascadingDelete } from "../_helpers/truncate";
import { loginAsNewlyCreatedUser } from "./User.util";
import { testContextFactory } from "../../_helpers";
import { mutationDeckCreateEmpty, queryDeckScalars, queryDecks } from "./Deck.util";
import type { CurrentUser } from "../../../src/types";

describe("graphql/Deck.ts", () => {

	let setSub: (sub?: CurrentUser) => void;
	let context: ContextFunction;
	let stopContext: () => Promise<unknown>;
	let prisma: PrismaClient;
	let apollo: ApolloServer;

	beforeAll(() => {
		[setSub, context, stopContext, { prisma }] = testContextFactory();
		apollo = apolloFactory(context);
	});

	afterAll(async () => {
		await cascadingDelete(prisma).user;
		await Promise.allSettled([apollo.stop(), stopContext()]);
	});

	afterEach(async () => {
		await cascadingDelete(prisma).user;
	});

	describe("Mutation.deckCreate", () => {
		it("should be able to create an empty deck", async () => {
			expect.assertions(1);
			await loginAsNewlyCreatedUser(apollo, setSub);
			const createDeckRes = await mutationDeckCreateEmpty(apollo);
			expect(createDeckRes).toHaveProperty("data.deckCreate.id", expect.any(String));
		});
	});

	describe("Query.deck", () => {
		it("should be able to return scalars of an owned deck", async () => {
			expect.assertions(1);
			const currentUser = await loginAsNewlyCreatedUser(apollo, setSub);
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
				ownerId: currentUser.id,
				promptLang: "",
				published: false,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				usedAt: expect.any(Date),
			});
		});
	});

	describe("Query.decks", () => {
		it("should be able to return ids of owned, unarchived decks", async () => {
			expect.assertions(1);
			await loginAsNewlyCreatedUser(apollo, setSub);
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
