/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { YogaInitialContext } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { Context } from "../../src/context";
import { createGraphQLApp } from "../../src/server";
import {
  mutationCreateUser,
  queryHealth,
  testContextFactory,
} from "../helpers";
import { cascadingDelete } from "./_helpers/truncate";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

describe("server", () => {
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(() => {
    [, context, stopContext, { prisma }] = testContextFactory();
    const server = createGraphQLApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  it("should be able to respond to a health check", async () => {
    expect.assertions(1);
    const response = await queryHealth(executor);
    expect(response).toHaveProperty("data.health", "OK");
  });

  it("should be able to respond to a basic create user", async () => {
    expect.assertions(1);
    const response = await mutationCreateUser(executor);
    expect(response).toHaveProperty(
      "data.finalizeOauthSignin.token",
      expect.any(String)
    );
  });
});
