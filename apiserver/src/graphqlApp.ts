import { YogaInitialContext, createYoga } from 'graphql-yoga';
import { Context } from './context';
import { schema } from './schema';

const { NODE_ENV } = process.env;

// This type is defined because GraphQL Yoga doesn't export the YogaNodeServer type.
export type WrServer = ReturnType<typeof createGraphQLApp>;

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

export function createGraphQLApp(opts: GraphQLServerFactoryOpts) {
  return createYoga<Record<string, unknown>, Context>({
    schema,
    graphiql: {
      subscriptionsProtocol: 'WS',
    },
    maskedErrors: NODE_ENV === 'production',
    ...opts,
  });
}
