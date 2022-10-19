/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "@prisma/client";
import { YogaInitialContext } from "graphql-yoga";

import { cascadingDelete } from "../_helpers/truncate";
import { DEFAULT_CREATE_USER_VALUES, createUser, mutationUserEdit, queryAllUserAccessibleUserScalars, queryUserPublicScalars, testContextFactory, unsafeJwtToCurrentUser } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { Context } from "../../../src/context";
import { WrServer, createGraphQLApp } from "../../../src/graphqlApp";

describe("graphql/User.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let server: WrServer;

  beforeAll(() => {
    [setSub, , context, stopContext, { prisma }] = testContextFactory();
    server = createGraphQLApp({ context });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    setSub(undefined);
    await cascadingDelete(prisma).user;
  });

  describe("Mutation", () => {
    describe("signin", () => {
      it("should be able to create a user with development authentication in test environment", async () => {
        expect.assertions(2);
        const response = await createUser(server);
        expect(response.body).toHaveProperty("data.finalizeThirdPartyOauthSignin", expect.any(String));
        const currentUser = unsafeJwtToCurrentUser(response.body!.data!.finalizeThirdPartyOauthSignin as string);
        expect(currentUser).toEqual({
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
        const createUserResponse = await createUser(server);
        const currentUser = unsafeJwtToCurrentUser(createUserResponse.body!.data!.finalizeThirdPartyOauthSignin as string);
        setSub(currentUser);
        const queryUserRequest = await queryAllUserAccessibleUserScalars(server, currentUser.id);
        expect(queryUserRequest).toHaveProperty("body.data.user", {
          id: currentUser.id,
          name: DEFAULT_CREATE_USER_VALUES.name,
          isPublic: false,
          roles: [Roles.user],
        });
      });
      it("should not be able to fetch all user-accessible fields of private user if not logged in", async () => {
        expect.assertions(2);
        const createUserResponse = await createUser(server);
        const { id } = unsafeJwtToCurrentUser(createUserResponse.body?.data?.finalizeThirdPartyOauthSignin as string);
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, id);
        expect(queryUserResponse.body!.data).toBeNull();
        expect(queryUserResponse.body!.errors).not.toHaveLength(0);
      });
      it("should not be able to fetch all user-accessible fields of private user if logged in as another user", async () => {
        expect.assertions(2);
        const createUserResponse1 = await createUser(server, { name: "user1" });
        const { id } = unsafeJwtToCurrentUser(createUserResponse1.body!.data!.finalizeThirdPartyOauthSignin as string);
        const createUserResponse2 = await createUser(server, { name: "user2" });
        const currentUser = unsafeJwtToCurrentUser(createUserResponse2.body!.data!.finalizeThirdPartyOauthSignin as string);
        setSub(currentUser);
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, id);
        expect(queryUserResponse.body!.data).toBeNull();
        expect(queryUserResponse.body!.errors).not.toHaveLength(0);
      });
      it("should be able to fetch public fields of private user if not logged in", async () => {
        expect.assertions(1);
        const createUserResponse = await createUser(server);
        const { id } = unsafeJwtToCurrentUser(createUserResponse.body!.data!.finalizeThirdPartyOauthSignin as string);
        const queryUserResponse = await queryUserPublicScalars(server, id);
        expect(queryUserResponse).toHaveProperty("body.data.user", {
          id,
          isPublic: false,
        });
      });
      it("should be able to fetch public fields of private user if logged in as another user", async () => {
        expect.assertions(1);
        const createUserResponse1 = await createUser(server, { name: "user1" });
        const { id } = unsafeJwtToCurrentUser(createUserResponse1.body!.data!.finalizeThirdPartyOauthSignin as string);
        const createUserResponse2 = await createUser(server, { name: "user2" });
        const currentUser = unsafeJwtToCurrentUser(createUserResponse2.body!.data!.finalizeThirdPartyOauthSignin as string);
        setSub(currentUser);
        const queryUserResponse = await queryUserPublicScalars(server, id);
        expect(queryUserResponse).toHaveProperty("body.data.user", {
          id,
          isPublic: false,
        });
      });
      it("should be able to fetch all fields of public user if not logged in", async () => {
        expect.assertions(1);
        const createUserResponse = await createUser(server);
        const currentUser = unsafeJwtToCurrentUser(createUserResponse.body!.data!.finalizeThirdPartyOauthSignin as string);
        setSub(currentUser);
        await mutationUserEdit(server, { isPublic: true });
        setSub(undefined);
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, currentUser.id);
        expect(queryUserResponse).toHaveProperty("body.data.user", {
          id: currentUser.id,
          name: DEFAULT_CREATE_USER_VALUES.name,
          isPublic: true,
          roles: [Roles.user],
        });
      });
      it("should be able to fetch all fields of public user if logged in as another user", async () => {
        expect.assertions(1);
        const createUserResponse1 = await createUser(server, { name: "user1" });
        const targetUser = unsafeJwtToCurrentUser(createUserResponse1.body!.data!.finalizeThirdPartyOauthSignin as string);
        setSub(targetUser);
        await mutationUserEdit(server, { isPublic: true });
        const createUserResponse2 = await createUser(server, { name: "user2" });
        const currentUser = unsafeJwtToCurrentUser(createUserResponse2.body!.data!.finalizeThirdPartyOauthSignin as string);
        setSub(currentUser);
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, targetUser.id);
        expect(queryUserResponse).toHaveProperty("body.data.user", {
          id: targetUser.id,
          name: "user1",
          isPublic: true,
          roles: [Roles.user],
        });
      });
    });
  });
});
