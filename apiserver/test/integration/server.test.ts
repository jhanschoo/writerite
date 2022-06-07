import { YogaInitialContext } from "@graphql-yoga/common";
import { PrismaClient } from "@prisma/client";
import { Context } from "../../src/context";
import { WrServer, graphQLServerFactory } from "../../src/graphqlServer";
import { createUser, queryHealth, testContextFactory } from "../helpers";
import { cascadingDelete } from "./_helpers/truncate";

describe("server", () => {

	let context: (initialContext: YogaInitialContext) => Context;
	let stopContext: () => Promise<unknown>;
	let prisma: PrismaClient;
	let server: WrServer;

	beforeAll(() => {
		[, , context, stopContext, { prisma }] = testContextFactory();
		server = graphQLServerFactory({ context });
	});

	afterAll(async () => {
		await cascadingDelete(prisma).user;
		await Promise.allSettled([server.stop(), stopContext()]);
	});

	it("should be able to respond to a health check", async () => {
		expect.assertions(1);
		const { executionResult } = await queryHealth(server);
		expect(executionResult).toHaveProperty("data.health", "OK");
	});

	it("should be able to respond to a basic create user", async () => {
		expect.assertions(1);
		const { executionResult } = await createUser(server);
		expect(executionResult).toHaveProperty("data.finalizeThirdPartyOauthSignin", expect.any(String));
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		// expect(typeof executionResult.data.finalizeThirdPartyOauthSignin).toBe("string");
	});
});
