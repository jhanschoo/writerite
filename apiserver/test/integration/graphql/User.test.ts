import { ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-koa";
import { GraphQLError } from "graphql";
import { PrismaClient } from "@prisma/client";

import { apolloFactory } from "../../../src/apollo";
import { cascadingDelete } from "../_helpers/truncate";
import { DEFAULT_CREATE_USER_VALUES, createUser, createUserWithEmail, queryAllUserAccessibleUserScalars, queryUserPublicScalars, mutationUserEdit } from "./User.util";
import { testContextFactory, unsafeJwtToCurrentUser } from "../../_helpers";
import { CurrentUser, Roles } from "../../../src/types";

describe("graphql/User.ts", () => {

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
		setSub(undefined);
		await cascadingDelete(prisma).user;
	});

	describe("Mutation.signin", () => {
		it("should be able to create a user with development authentication in test environment", async () => {
			expect.assertions(3);
			const res = await createUser(apollo, DEFAULT_CREATE_USER_VALUES);
			expect(res).toHaveProperty("data.signin");
			expect(typeof res.data?.signin).toBe("string");
			const currentUser = unsafeJwtToCurrentUser(res.data?.signin as string);
			expect(currentUser).toEqual({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				id: expect.any(String),
				email: DEFAULT_CREATE_USER_VALUES.email,
				roles: [Roles.user],
				name: "",
			});
		});
	});

	describe("Query.user", () => {
		it("should be able to fetch all user-accessible fields of current user", async () => {
			expect.assertions(1);
			const createUserRes = await createUser(apollo, DEFAULT_CREATE_USER_VALUES);
			const currentUser = unsafeJwtToCurrentUser(createUserRes.data?.signin as string);
			setSub(currentUser);
			const queryUserRes = await queryAllUserAccessibleUserScalars(apollo, currentUser.id);
			expect(queryUserRes.data?.user).toEqual({
				id: currentUser.id,
				email: DEFAULT_CREATE_USER_VALUES.email,
				name: "",
				isPublic: false,
				roles: [Roles.user],
			});
		});
		it("should not be able to fetch all user-accessible fields of private user if not logged in", async () => {
			expect.assertions(2);
			const createUserRes = await createUser(apollo);
			const { id } = unsafeJwtToCurrentUser(createUserRes.data?.signin as string);
			const queryUserRes = await queryAllUserAccessibleUserScalars(apollo, id);
			expect(queryUserRes.data).toBeNull();
			expect(queryUserRes.errors).toEqual([expect.any(GraphQLError)]);
		});
		it("should not be able to fetch all user-accessible fields of private user if logged in as another user", async () => {
			expect.assertions(2);
			const createUser1Res = await createUserWithEmail(apollo, "abs@xyz.com");
			const { id } = unsafeJwtToCurrentUser(createUser1Res.data?.signin as string);
			const createUser2Res = await createUserWithEmail(apollo, "bcd@xyz.com");
			const currentUser = unsafeJwtToCurrentUser(createUser2Res.data?.signin as string);
			setSub(currentUser);
			const queryUserRes = await queryAllUserAccessibleUserScalars(apollo, id);
			expect(queryUserRes.data).toBeNull();
			expect(queryUserRes.errors).toEqual([expect.any(GraphQLError)]);
		});
		it("should be able to fetch public fields of private user if not logged in", async () => {
			expect.assertions(1);
			const createUserRes = await createUser(apollo);
			const { id } = unsafeJwtToCurrentUser(createUserRes.data?.signin as string);
			const queryUserRes = await queryUserPublicScalars(apollo, id);
			expect(queryUserRes.data?.user).toEqual({
				id,
				isPublic: false,
			});
		});
		it("should be able to fetch public fields of private user if logged in as another user", async () => {
			expect.assertions(1);
			const createUser1Res = await createUserWithEmail(apollo, "abs@xyz.com");
			const { id } = unsafeJwtToCurrentUser(createUser1Res.data?.signin as string);
			const createUser2Res = await createUserWithEmail(apollo, "bcd@xyz.com");
			const currentUser = unsafeJwtToCurrentUser(createUser2Res.data?.signin as string);
			setSub(currentUser);
			const queryUserRes = await queryUserPublicScalars(apollo, id);
			expect(queryUserRes.data?.user).toEqual({
				id,
				isPublic: false,
			});
		});
		it("should be able to fetch all fields of public user if not logged in", async () => {
			expect.assertions(1);
			const createUserRes = await createUser(apollo);
			const currentUser = unsafeJwtToCurrentUser(createUserRes.data?.signin as string);
			setSub(currentUser);
			await mutationUserEdit(apollo, { isPublic: true });
			setSub(undefined);
			const queryUserRes = await queryAllUserAccessibleUserScalars(apollo, currentUser.id);
			expect(queryUserRes.data?.user).toEqual({
				id: currentUser.id,
				email: DEFAULT_CREATE_USER_VALUES.email,
				name: "",
				isPublic: true,
				roles: [Roles.user],
			});
		});
		it("should be able to fetch all fields of public user if logged in as another user", async () => {
			expect.assertions(1);
			const createUser1Res = await createUserWithEmail(apollo, "abc@xyz.com");
			const targetUser = unsafeJwtToCurrentUser(createUser1Res.data?.signin as string);
			setSub(targetUser);
			await mutationUserEdit(apollo, { isPublic: true });
			const createUser2Res = await createUserWithEmail(apollo, "bcd@xyz.com");
			const currentUser = unsafeJwtToCurrentUser(createUser2Res.data?.signin as string);
			setSub(currentUser);
			const queryUserRes = await queryAllUserAccessibleUserScalars(apollo, targetUser.id);
			expect(queryUserRes.data?.user).toEqual({
				id: targetUser.id,
				email: "abc@xyz.com",
				name: "",
				isPublic: true,
				roles: [Roles.user],
			});
		});
	});
});
