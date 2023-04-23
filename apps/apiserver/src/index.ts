import { RequestListener, Server, createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { WrServer, createYogaServerApp } from 'yoga-app';

import { contextFactory } from './context';

const { NODE_ENV } = process.env;

export const [contextFn, stopContextServices] = contextFactory();

const graphqlEndpoint = '/graphql';

export const yoga: WrServer = createYogaServerApp({
  context: contextFn,
  cors: {
    origin:
      NODE_ENV === 'production'
        ? 'https://www.writerite.site'
        : 'http://localhost:3000',
  },
  graphqlEndpoint,
});

async function main(): Promise<[Server, WebSocketServer]> {
  const httpServer = createServer(yoga as RequestListener);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: graphqlEndpoint,
  });
  useServer(
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      execute: (args: any) => args.rootValue.execute(args),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-unsafe-assignment
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yoga.getEnveloped({
            // setting the params field is required for compatibility with envelope plugins that assume i guess a http-like request
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            params: { ...(ctx as any).params, ...msg.payload },
            ...ctx,
            extensions: msg,
          });
        const args = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          schema,
          operationName: msg.payload.operationName,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const errors = validate(args.schema, args.document);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (errors.length) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return errors;
        }
        return args;
      },
    },
    wsServer
  );
  return new Promise((res, rej) => {
    let rejected = false;
    let resolved = false;
    httpServer.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      if (rejected || resolved) {
        return;
      }
      rejected = true;
      rej(err);
    });
    httpServer.listen(4000, () => {
      if (rejected) {
        httpServer.close();
      } else {
        resolved = true;
        res([httpServer, wsServer]);
      }
    });
  });
}

const mainPromise = main();
mainPromise.catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

export async function stop(): Promise<PromiseSettledResult<unknown>[]> {
  const [httpServer, wsServer] = await mainPromise;
  httpServer.removeAllListeners();
  return Promise.allSettled<unknown>([
    new Promise<void>((res, rej) => {
      httpServer.close((err) => (err ? rej(err) : res()));
    }),
    new Promise<void>((res, rej) => {
      wsServer.close((err) => (err ? rej(err) : res()));
    }),
    stopContextServices(),
  ]);
}
