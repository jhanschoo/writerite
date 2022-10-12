import { YogaInitialContext } from "@graphql-yoga/common";
import { createServer } from "@graphql-yoga/node";
import { ServerOptions } from "https";
import { Context } from "./context";
import { schema } from "./schema";

const { NODE_ENV } = process.env;

// This type is defined because GraphQL Yoga doesn't export the YogaNodeServer type.
export type WrServer = ReturnType<typeof graphQLServerFactory>;

interface CORSOptions {
  origin?: string[] | string;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

interface GraphQLServerFactoryOpts {
  port?: number;
  https?: ServerOptions;
  cors?: CORSOptions;
  context(initialContext: YogaInitialContext): Promise<Context>;
}

export function graphQLServerFactory(opts: GraphQLServerFactoryOpts) {
  return createServer<Record<string, unknown>, Context>({
    schema,
    graphiql: {
      subscriptionsProtocol: "WS",
    },
    maskedErrors: NODE_ENV === "production",
    ...opts,
  });
}
