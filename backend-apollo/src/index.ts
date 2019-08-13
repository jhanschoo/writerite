import './assertConfig';
import fs from 'fs';
import https from 'https';
import http from 'http';

import Redis from 'ioredis';

import { RedisPubSub } from 'graphql-redis-subscriptions';

import Koa from 'koa';
import helmet from 'koa-helmet';

import { ApolloServer, gql } from 'apollo-server-koa';

import { prisma } from '../generated/prisma-client';
import models from './model';
import resolvers from './resolver';
import { makeExecutableSchema } from 'apollo-server-koa';

import { getClaims, generateJWT } from './util';

const {
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  CERT_FILE,
  KEY_FILE,
} = process.env;

// Initialize redis connection

const redisOptions = {
  host: REDIS_HOST || '127.0.0.1',
  port: (REDIS_PORT) ? parseInt(REDIS_PORT , 10) : 6379,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const pubsub = new RedisPubSub({
  publisher: new Redis({ ...redisOptions, db: 2 }),
  subscriber: new Redis({ ...redisOptions, db: 2 }),
});

const redisClient = new Redis({ ...redisOptions, db: 1 });
redisClient.on('error', (err) => {
  // tslint:disable-next-line: no-console
  console.error(`redisClient error: ${err}`);
});

const wrightJWT = generateJWT({
  id: 'theWright',
  email: 'wright@writerite.site',
  roles: ['wright'],
});

const writeJWT = () => {
  redisClient.set('writerite:wright:jwt', wrightJWT)
    .then(() => setTimeout(writeJWT, 60000));
};
writeJWT();

// Initialize express

const app = new Koa();

app.use(helmet());

const typeDefs = gql(fs.readFileSync('schema.graphql', 'utf8'));

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apollo = new ApolloServer({
  schema,
  context: (ctx) => {
    return {
      sub: getClaims(ctx),
      models,
      prisma,
      pubsub,
      redisClient,
    };
  },
  mocks: NODE_ENV === 'frontend-testing',
  debug: NODE_ENV !== 'production',
});

apollo.applyMiddleware({
  app,
  cors: {
    origin: NODE_ENV === 'production'
      ? 'https://writerite.site'
      : 'https://localhost:3000',
    credentials: true,
  },
});

const server = (CERT_FILE && KEY_FILE)
  ? https.createServer({
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
  }, app.callback())
  : http.createServer(app.callback());

// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33764
// @ts-ignore
apollo.installSubscriptionHandlers(server);

server.listen({ port: 4000 }, () => {
  // tslint:disable-next-line no-console
  console.log(`🚀 Server ready at http${
    (CERT_FILE && KEY_FILE) ? 's' : ''
  }://localhost:${4000}${apollo.graphqlPath} in environment ${NODE_ENV}`);
});
