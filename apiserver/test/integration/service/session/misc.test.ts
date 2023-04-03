/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "@prisma/client";
import { YogaInitialContext } from "graphql-yoga";

import { cascadingDelete } from "../../_helpers/truncate";
import { loginAsNewlyCreatedUser, testContextFactory } from "../../../helpers";
import { Context } from "../../../../src/context";
import { createGraphQLApp } from "../../../../src/server";
import {
  CurrentUser,
  Roles,
  currentUserToUserJWT,
} from "../../../../src/service/userJWT";
import Redis from "ioredis";
import {
  currentUserSourceToCurrentUser,
  findOrCreateCurrentUserSourceWithProfile,
} from "../../../../src/service/authentication/util";
import {
  getClaims,
  invalidateByRoomSlug,
  invalidateByUserId,
} from "../../../../src/service/session";
import { mutationRoomCreate } from "../../../helpers/graphql/Room.util";
import { sleep } from "../../../../src/util";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

describe("service/session", () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let redis: Redis;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(async () => {
    [setSub, context, stopContext, { prisma, redis }] = testContextFactory();
    const server = createGraphQLApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
    await redis.flushdb();
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await redis.flushdb();
    await stopContext();
  });

  afterEach(async () => {
    setSub(undefined);
    await cascadingDelete(prisma).user;
    await redis.flushdb();
  });

  it("should be able to get claims of valid JWTs on the platform", async () => {
    expect.assertions(2);

    // setup currentUser
    const { currentUser: user } = await loginAsNewlyCreatedUser(
      executor,
      setSub
    );
    const roomCreateResponse = await mutationRoomCreate(executor);
    const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
      prisma,
      user.name,
      "id"
    );
    const currentUser = currentUserSourceToCurrentUser(currentUserSource);

    // setup JWT
    const userJWT = await currentUserToUserJWT(currentUser);
    expect(currentUser).toEqual({
      id: user.id,
      name: user.name,
      roles: [Roles.User],
      occupyingActiveRoomSlugs: {
        [roomCreateResponse.data.roomCreate.slug]:
          roomCreateResponse.data.roomCreate.id,
      },
    });

    // validate JWT
    const authorization = `Bearer ${userJWT}`;
    const sub = await getClaims(
      {
        request: {
          headers: {
            get: (headerKey: string) =>
              headerKey === "Authorization" ? authorization : undefined,
          },
        },
      } as unknown as YogaInitialContext,
      redis
    );
    expect(sub).toEqual(currentUser);
  });

  it("should not be able to get claims after JWTs have been invalidated by userId", async () => {
    expect.assertions(1);

    // setup currentUser
    const { currentUser: user } = await loginAsNewlyCreatedUser(
      executor,
      setSub
    );
    await mutationRoomCreate(executor);
    const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
      prisma,
      user.name,
      "id"
    );
    const currentUser = currentUserSourceToCurrentUser(currentUserSource);

    // setup JWT
    const userJWT = await currentUserToUserJWT(currentUser);

    // invalidate JWT
    await sleep(1010);
    await invalidateByUserId(redis, currentUser.id);

    // check JWT validity
    const authorization = `Bearer ${userJWT}`;
    const sub = await getClaims(
      {
        request: {
          headers: {
            get: (headerKey: string) =>
              headerKey === "Authorization" ? authorization : undefined,
          },
        },
      } as unknown as YogaInitialContext,
      redis
    );
    expect(sub).toBeUndefined();
  });

  it("should not be able to get claims after JWTs have been invalidated by room slug", async () => {
    expect.assertions(1);

    // setup currentUser
    const { currentUser: user } = await loginAsNewlyCreatedUser(
      executor,
      setSub
    );
    const roomCreateResponse = await mutationRoomCreate(executor);
    const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
      prisma,
      user.name,
      "id"
    );
    const currentUser = currentUserSourceToCurrentUser(currentUserSource);

    // setup JWT
    const userJWT = await currentUserToUserJWT(currentUser);

    // invalidate JWT
    await sleep(1010);
    await invalidateByRoomSlug(
      redis,
      roomCreateResponse.data.roomCreate.slug as string
    );

    // check JWT validity
    const authorization = `Bearer ${userJWT}`;
    const sub = await getClaims(
      {
        request: {
          headers: {
            get: (headerKey: string) =>
              headerKey === "Authorization" ? authorization : undefined,
          },
        },
      } as unknown as YogaInitialContext,
      redis
    );
    expect(sub).toBeUndefined();
  });
});
