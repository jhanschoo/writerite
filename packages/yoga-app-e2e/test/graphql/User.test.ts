/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "database";
import { YogaInitialContext } from "graphql-yoga";

import { cascadingDelete } from "../helpers/truncate";
import {
  DEFAULT_CREATE_USER_VALUES,
  mutationCreateUser,
  mutationUserEdit,
  queryMe,
  testContextFactory,
} from "../helpers";
import { Context, CurrentUser, createYogaServerApp, Roles } from "yoga-app";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

describe("graphql/User.ts", () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma }] = testContextFactory();
    const server = createYogaServerApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
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
    describe("finalizeOauthSignin", () => {
      it("should be able to create a user with development authentication in test environment", async () => {
        expect.assertions(2);

        const name = "user1";
        // create user
        const response = await mutationCreateUser(executor, { name });
        expect(response).toHaveProperty(
          "data.finalizeOauthSignin.token",
          expect.any(String)
        );
        const currentUser = response.data?.finalizeOauthSignin
          ?.currentUser as unknown as CurrentUser;
        expect(currentUser).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          occupyingRoomSlugs: {},
          roles: [Roles.User],
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

        // create user
        const createUserResponse = await mutationCreateUser(executor);
        const currentUserBefore = createUserResponse.data?.finalizeOauthSignin
          ?.currentUser as unknown as CurrentUser;

        // login as user
        setSub(currentUserBefore);

        // query own user
        const queryUserRequest = await queryMe(executor, {});
        expect(queryUserRequest).toHaveProperty("data.me", {
          name: DEFAULT_CREATE_USER_VALUES.name,
          isPublic: false,
          roles: [Roles.User],
        });
      });
    });
  });
});
