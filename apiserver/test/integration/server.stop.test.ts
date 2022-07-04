import { contextFactory } from "../../src/context";
import { graphQLServerFactory } from "../../src/graphqlServer";
import { queryHealth } from "../helpers/graphql/Health.util";

describe("server", () => {

  it("should be able to be raised and destroyed", async () => {
    expect.assertions(1);
    const [ctxFn, stopCtx] = contextFactory();
    const server = graphQLServerFactory({ context: ctxFn });
    const { executionResult } = await queryHealth(server);
    expect(executionResult).toHaveProperty("data.health", "OK");
    await stopCtx();
  });
});
