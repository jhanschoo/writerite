import { ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-koa";
import { PrismaClient } from "@prisma/client";

import { apolloFactory } from "../../../src/apollo";
import { cascadingDelete } from "../_helpers/truncate";
import { createUser } from "./User";
import { testContextFactory, unsafeJwtToCurrentUser } from "../../_helpers";

describe("graphql/Deck.ts", () => {

	let context: ContextFunction;
	let stopContext: () => Promise<unknown>;
	let prisma: PrismaClient;
	let apollo: ApolloServer;

	beforeAll(() => {
		[, context, stopContext, { prisma }] = testContextFactory();
		apollo = apolloFactory(context);
	});

	afterAll(async () => {
		await cascadingDelete(prisma).user;
		await Promise.allSettled([apollo.stop(), stopContext()]);
	});

	afterEach(async () => {
		await cascadingDelete(prisma).user;
	});

	describe("signin", () => {
		it("should be able to create a user with development authentication in test environment", async () => {
			expect.assertions(3);
			const res = await createUser(apollo);
			expect(res).toHaveProperty("data.signin");
			expect(typeof res.data?.signin).toBe("string");
			const currentUser = unsafeJwtToCurrentUser(res.data.signin as string);
			expect(currentUser).toHaveProperty("email");
		});
	});
});
