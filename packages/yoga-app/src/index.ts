import { YogaInitialContext, createYoga } from "graphql-yoga";
import type { Context } from "./context";
export type { Context } from "./context";
import { schema } from "./schema";
export type { CurrentUser } from "./service/userJWT/CurrentUser";
export { Roles } from "./service/userJWT/Roles";
export { getClaims } from "./service/session";
export type { PubSubPublishArgs } from "./types/PubSubPublishArgs";

const { NODE_ENV } = process.env;

// This type is defined because GraphQL Yoga doesn't export the YogaNodeServer type.
export type WrServer = ReturnType<typeof createYogaServerApp>;

interface CORSOptions {
  origin?: string[] | string;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

interface GraphQLServerFactoryOpts {
  cors?: CORSOptions;
  logging?: boolean;
  graphqlEndpoint?: string;
  context(initialContext: YogaInitialContext): Promise<Context>;
}

export function createYogaServerApp(opts: GraphQLServerFactoryOpts) {
  return createYoga<Record<string, unknown>, Context>({
    schema,
    graphiql: {
      subscriptionsProtocol: "WS",
    },
    maskedErrors: NODE_ENV === "production",
    ...opts,
  });
}
