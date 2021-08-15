import "./assertConfig";
import fs from "fs";

import type { ContextFunction } from "apollo-server-core";
import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-koa";

import resolvers from "./resolver";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { GRAPH_VARIANT, NODE_ENV } = process.env;

const typeDefs = gql(fs.readFileSync("schema.graphql", "utf8"));

const schema = makeExecutableSchema({ typeDefs, resolvers });

export function createApollo(context: ContextFunction): ApolloServer {
  return new ApolloServer({
    schema,
    context,
    mocks: NODE_ENV === "frontend-testing",
    debug: NODE_ENV !== "production",
    engine: {
      reportSchema: true,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      graphVariant: GRAPH_VARIANT || undefined,
    },
  });
}
