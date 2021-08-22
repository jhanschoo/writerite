import { PrismaClient } from "@prisma/client";
import { ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-koa";
import { apolloFactory } from "../../src/apollo";
import { createUser } from "./seed/createUser";
import { cascadingDelete } from "./seed/truncate";
import { testContextFactory } from "../_helpers";

describe("apollo", () => {

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

	it("should be able to create a basic query", async () => {
		expect.assertions(2);
		const res = await createUser(apollo);
		expect(res).toHaveProperty("data.signin");
		expect(typeof res.data?.signin).toBe("string");
	});
});
