import "./assertConfig";
import fs from "fs";
import https from "https";
import http from "http";

import Redis from "ioredis";

import { RedisPubSub } from "graphql-redis-subscriptions";

import Koa from "koa";
import helmet from "koa-helmet";

import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-koa";
import type { DataSource } from "apollo-datasource";

import { WrDDataSource } from "./db-datasource/WrDDataSource";
import { WrRDataSource } from "./r-datasource/WrRDataSource";

import resolvers from "./resolver";

import type { WrContext } from "./types";
import { generateJWT, getClaims } from "./util";

const {
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_BACKEND_APOLLO_USER,
  POSTGRES_BACKEND_APOLLO_PASSWORD,
  POSTGRES_BACKEND_APOLLO_DATABASE,
  REDIS_HOST,
  REDIS_PORT,
  CERT_FILE,
  KEY_FILE,
} = process.env;

// Initialize db connection
const knexConfig = {
  client: "pg",
  connection: {
    host: POSTGRES_HOST,
    user: POSTGRES_BACKEND_APOLLO_USER,
    password: POSTGRES_BACKEND_APOLLO_PASSWORD,
    database: POSTGRES_BACKEND_APOLLO_DATABASE,
  },
  debug: NODE_ENV !== "production",
};

const wrRDS = new WrRDataSource(new WrDDataSource(knexConfig));

// Initialize redis connection

const redisOptions = {
  host: REDIS_HOST ?? "127.0.0.1",
  port: REDIS_PORT ? parseInt(REDIS_PORT, 10) : 6379,
  retryStrategy: (times: number): number => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const pubsub = new RedisPubSub({
  publisher: new Redis({ ...redisOptions, db: 2 }),
  subscriber: new Redis({ ...redisOptions, db: 2 }),
});

const redisClient = new Redis({ ...redisOptions, db: 1 });
redisClient.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error(`redisClient error: ${err}`);
});

const wrightJWT = generateJWT({
  id: "theWright",
  email: "wright@writerite.site",
  roles: ["wright"],
});

function writeJWT(): void {
  redisClient.set("writerite:wright:jwt", wrightJWT)
    .then(() => setTimeout(writeJWT, 60000))
    .catch((e) => {
      throw new Error(`Unable to write writerite:wright:jwt : ${e}`);
    });
}
writeJWT();

// Initialize express

const app = new Koa();

app.use(helmet());

const typeDefs = gql(fs.readFileSync("schema.graphql", "utf8"));

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apollo = new ApolloServer({
  schema,
  context: (ctx): object => ({
    sub: getClaims(ctx),
    pubsub,
    redisClient,
  }),
  dataSources: (): { wrRDS: DataSource<WrContext> } => ({ wrRDS }),
  mocks: NODE_ENV === "frontend-testing",
  debug: NODE_ENV !== "production",
});

apollo.applyMiddleware({
  app,
  cors: {
    origin: NODE_ENV === "production"
      ? "https://app.writerite.site"
      : "https://localhost:3000",
    credentials: true,
  },
});

const server = CERT_FILE && KEY_FILE
  ? https.createServer({
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
  }, app.callback())
  : http.createServer(app.callback());

apollo.installSubscriptionHandlers(server);

server.listen({ port: 4000 }, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http${
    CERT_FILE && KEY_FILE ? "s" : ""
  }://localhost:${4000}${apollo.graphqlPath} in environment ${NODE_ENV}`);
});
