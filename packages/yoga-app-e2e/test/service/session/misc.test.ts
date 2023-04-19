/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "database";
import { YogaInitialContext } from "graphql-yoga";
import { decodeGlobalID, encodeGlobalID } from "@pothos/plugin-relay";

import { cascadingDelete } from "../../helpers/truncate";
import { loginAsNewlyCreatedUser, testContextFactory } from "../../helpers";
import { Context, CurrentUser, Roles, createYogaServerApp } from "yoga-app";
import { currentUserToUserJWT } from "yoga-app/src/service/userJWT";
import Redis from "ioredis";
import {
  currentUserSourceToCurrentUser,
  findOrCreateCurrentUserSourceWithProfile,
} from "yoga-app/src/service/authentication/util";
import {
  getClaims,
  invalidateByRoomId,
  invalidateByUserId,
} from "yoga-app/src/service/session";
import { mutationRoomCreate } from "../../helpers/graphql/Room.util";
import { sleep } from "yoga-app/src/util";
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
    const server = createYogaServerApp({ context, logging: false });
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
    const rid = decodeGlobalID(
      roomCreateResponse.data?.roomCreate.id as string
    );
    expect(currentUser).toEqual({
      id: user.id,
      name: user.name,
      roles: [Roles.User],
      occupyingRoomSlugs: { [rid.id]: null },
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
    const lid = decodeGlobalID(
      roomCreateResponse.data?.roomCreate.id as string
    );
    await invalidateByRoomId(redis, lid.id);

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
