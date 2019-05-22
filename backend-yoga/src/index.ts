import './assertConfig';
import fs from 'fs';
import https from 'https';
import http from 'http';

import Redis from 'ioredis';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { importSchema } from 'graphql-import';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { ApolloServer, gql } from 'apollo-server-express';

import { prisma } from '../generated/prisma-client';
import resolvers from './resolver';

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

const redisClient = new Redis({ ...redisOptions, db: 2 });
redisClient.on('error', (err) => {
  // tslint:disable-next-line: no-console
  console.error(`redisClient error: ${err}`);
});

const pubsub = new RedisPubSub({
  publisher: new Redis({ ...redisOptions, db: 1 }),
  subscriber: new Redis({ ...redisOptions, db: 1 }),
});

const acolyteJWT = generateJWT({
  id: 'acolyte',
  email: 'acolyte@writerite.site',
  roles: ['acolyte'],
});

// Send authorization to redis
// TODO: have redis generate instead

const writeJWT = () => {
  redisClient.set('writerite:acolyte:jwt', acolyteJWT)
    .then(() => setTimeout(writeJWT, 10000));
};
writeJWT();

// Initialize express

const app = express();

app.use(helmet());
app.use(cors());

const typeDefs = gql(importSchema('src/schema/schema.graphql'));

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => {
    const sub = getClaims(req);
    const ctx = {
      sub,
      prisma,
      pubsub,
      redisClient,
    };
    return ctx;
  },
  mocks: NODE_ENV === 'testing',
  debug: NODE_ENV !== 'production',
});

apollo.applyMiddleware({
  app,
  cors: {
    origin: NODE_ENV === 'production' ? /https:\/\/writerite.site/ : /https:\/\/localhost:3000/,
    credentials: true,
  },
});

const server = (CERT_FILE && KEY_FILE)
  ? https.createServer({
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
  }, app)
  : http.createServer(app);

// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33764
// @ts-ignore
apollo.installSubscriptionHandlers(server);

server.listen({ port: 4000 }, () => {
  // tslint:disable-next-line no-console
  console.log(`🚀 Server ready at http${
    (CERT_FILE && KEY_FILE) ? 's' : ''
  }://localhost:${4000}${apollo.graphqlPath} in environment ${NODE_ENV}`);
});
