/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { contextFactory } from "../../src/context";
import { createGraphQLApp } from "../../src/graphqlApp";
import { queryHealth } from "../helpers/graphql/Health.util";

describe("server", () => {

  it("should be able to be raised and destroyed", async () => {
    expect.assertions(1);
    const [ctxFn, stopCtx] = contextFactory();
    const server = createGraphQLApp({ context: ctxFn });
    const response = await queryHealth(server);
    expect(response).toHaveProperty("body.data.health", "OK");
    await stopCtx();
  });
});
