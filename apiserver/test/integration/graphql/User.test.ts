import type { PrismaClient } from "@prisma/client";
import { YogaInitialContext } from "@graphql-yoga/node";

import { cascadingDelete } from "../_helpers/truncate";
import { DEFAULT_CREATE_USER_VALUES, createUser, mutationUserEdit, queryAllUserAccessibleUserScalars, queryUserPublicScalars, testContextFactory, unsafeJwtToCurrentUser } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { Context } from "../../../src/context";
import { WrServer, graphQLServerFactory } from "../../../src/graphqlServer";

describe("graphql/User.ts", () => {

	let setSub: (sub?: CurrentUser) => void;
	let context: (initialContext: YogaInitialContext) => Context;
	let stopContext: () => Promise<unknown>;
	let prisma: PrismaClient;
	let server: WrServer;

	beforeAll(() => {
		[setSub, , context, stopContext, { prisma }] = testContextFactory();
		server = graphQLServerFactory(context);
	});

	afterAll(async () => {
		await cascadingDelete(prisma).user;
		await Promise.allSettled([server.stop(), stopContext()]);
	});

	afterEach(async () => {
		setSub(undefined);
		await cascadingDelete(prisma).user;
	});

	describe("Mutation", () => {
		describe("signin", () => {
			it("should be able to create a user with development authentication in test environment", async () => {
				expect.assertions(3);
				const { executionResult } = await createUser(server);
				expect(executionResult).toHaveProperty("data.finalizeThirdPartyOauthSignin");
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(typeof executionResult.data.finalizeThirdPartyOauthSignin).toBe("string");
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const currentUser = unsafeJwtToCurrentUser(executionResult.data.finalizeThirdPartyOauthSignin as string);
				expect(currentUser).toEqual({
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					id: expect.any(String),
					roles: [Roles.user],
				});
			});
		});
		describe("userEdit", () => {
			// TODO: implement
		});
	});

	describe("Query", () => {
		describe("user", () => {
			it("should be able to fetch all user-accessible fields of current user", async () => {
				expect.assertions(1);
				const { executionResult: createUserExecutionResult } = await createUser(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const currentUser = unsafeJwtToCurrentUser(createUserExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				setSub(currentUser);
				const { executionResult: queryUserExecutionResult } = await queryAllUserAccessibleUserScalars(server, currentUser.id);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(queryUserExecutionResult.data.user).toEqual({
					id: currentUser.id,
					name: DEFAULT_CREATE_USER_VALUES.name,
					isPublic: false,
					roles: [Roles.user],
				});
			});
			it("should not be able to fetch all user-accessible fields of private user if not logged in", async () => {
				expect.assertions(2);
				const { executionResult: createUserExecutionResult } = await createUser(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const { id } = unsafeJwtToCurrentUser(createUserExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				const { executionResult: queryUserExecutionResult } = await queryAllUserAccessibleUserScalars(server, id);
				expect(queryUserExecutionResult.data).toBeNull();
				expect(queryUserExecutionResult.errors).not.toHaveLength(0);
			});
			it("should not be able to fetch all user-accessible fields of private user if logged in as another user", async () => {
				expect.assertions(2);
				const { executionResult: createUser1ExecutionResult } = await createUser(server, { name: "user1" });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const { id } = unsafeJwtToCurrentUser(createUser1ExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				const { executionResult: createUser2ExecutionResult } = await createUser(server, { name: "user2" });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const currentUser = unsafeJwtToCurrentUser(createUser2ExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				setSub(currentUser);
				const { executionResult: queryUserExecutionResult } = await queryAllUserAccessibleUserScalars(server, id);
				expect(queryUserExecutionResult.data).toBeNull();
				expect(queryUserExecutionResult.errors).not.toHaveLength(0);
			});
			it("should be able to fetch public fields of private user if not logged in", async () => {
				expect.assertions(1);
				const { executionResult: createUserExecutionResult } = await createUser(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const { id } = unsafeJwtToCurrentUser(createUserExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				const { executionResult: queryUserExecutionResult } = await queryUserPublicScalars(server, id);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(queryUserExecutionResult.data.user).toEqual({
					id,
					isPublic: false,
				});
			});
			it("should be able to fetch public fields of private user if logged in as another user", async () => {
				expect.assertions(1);
				const { executionResult: createUser1ExecutionResult } = await createUser(server, { name: "user1" });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const { id } = unsafeJwtToCurrentUser(createUser1ExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				const { executionResult: createUser2ExecutionResult } = await createUser(server, { name: "user2" });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const currentUser = unsafeJwtToCurrentUser(createUser2ExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				setSub(currentUser);
				const { executionResult: queryUserExecutionResult } = await queryUserPublicScalars(server, id);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(queryUserExecutionResult.data.user).toEqual({
					id,
					isPublic: false,
				});
			});
			it("should be able to fetch all fields of public user if not logged in", async () => {
				expect.assertions(1);
				const { executionResult: createUserExecutionResult } = await createUser(server);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const currentUser = unsafeJwtToCurrentUser(createUserExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				setSub(currentUser);
				await mutationUserEdit(server, { isPublic: true });
				setSub(undefined);
				const { executionResult: queryUserExecutionResult } = await queryAllUserAccessibleUserScalars(server, currentUser.id);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(queryUserExecutionResult.data.user).toEqual({
					id: currentUser.id,
					name: DEFAULT_CREATE_USER_VALUES.name,
					isPublic: true,
					roles: [Roles.user],
				});
			});
			it("should be able to fetch all fields of public user if logged in as another user", async () => {
				expect.assertions(1);
				const { executionResult: createUser1ExecutionResult } = await createUser(server, { name: "user1" });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const targetUser = unsafeJwtToCurrentUser(createUser1ExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				setSub(targetUser);
				await mutationUserEdit(server, { isPublic: true });
				const { executionResult: createUser2ExecutionResult } = await createUser(server, { name: "user2" });
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const currentUser = unsafeJwtToCurrentUser(createUser2ExecutionResult.data.finalizeThirdPartyOauthSignin as string);
				setSub(currentUser);
				const { executionResult: queryUserExecutionResult } = await queryAllUserAccessibleUserScalars(server, targetUser.id);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(queryUserExecutionResult.data.user).toEqual({
					id: targetUser.id,
					name: "user1",
					isPublic: true,
					roles: [Roles.user],
				});
			});
		});
	});
});
