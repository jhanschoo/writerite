/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { contextFactory } from "../../src/context";
import { createGraphQLApp } from "../../src/server";
import { queryHealth } from "../helpers/graphql/Health.util";

describe("server", () => {
  it("should be able to be raised and destroyed", async () => {
    expect.assertions(1);
    const [ctxFn, stopCtx] = contextFactory();
    const server = createGraphQLApp({ context: ctxFn, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const executor = buildHTTPExecutor({ fetch: server.fetch });
    const response = await queryHealth(executor);
    expect(response).toHaveProperty("data.health", "OK");
    await stopCtx();
  });
});
