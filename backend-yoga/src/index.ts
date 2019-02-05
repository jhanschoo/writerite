import './assertConfig';
import fs from 'fs';

import { GraphQLServer } from 'graphql-yoga';
import helmet from 'helmet';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { prisma } from '../generated/prisma-client';
import resolvers from './resolver';

import Redis from 'ioredis';

import { getClaims, generateJWT } from './util';

const {
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  CERT_FILE,
  KEY_FILE,
} = process.env;

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

// TODO: use redis instead when needed
const pubsub = new RedisPubSub({
  publisher: new Redis({ ...redisOptions, db: 1 }),
  subscriber: new Redis({ ...redisOptions, db: 1 }),
});

const acolyteJWT = generateJWT({
  id: 'acolyte',
  email: 'acolyte@writerite.site',
  roles: ['acolyte'],
});

const writeJWT = () => {
  redisClient.set('writerite:acolyte:jwt', acolyteJWT)
    .then(() => setTimeout(writeJWT, 10000));
};
writeJWT();

const server = new GraphQLServer({
  context: (req) => ({
    ...req,
    ...getClaims(req),
    prisma,
    pubsub,
    redisClient,
  }),
  mocks: NODE_ENV === 'testing',
  resolvers,
  typeDefs: 'src/schema/schema.graphql',
});

server.express.use(helmet());

server.start({
  cors: {
    origin: [/https:\/\/localhost:3000/, /https:\/\/writerite.site/],
    credentials: true,
  },
  debug: NODE_ENV !== 'production',
  https: (CERT_FILE && KEY_FILE)
    ? {
      cert: fs.readFileSync(CERT_FILE),
      key: fs.readFileSync(KEY_FILE),
    }
    : undefined,
  // tslint:disable-next-line no-console
}, () => console.log(`Server is running`));
