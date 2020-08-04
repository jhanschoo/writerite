import "./assertConfig";
import fs from "fs";
import https from "https";
import http from "http";

import Redis from "ioredis";

import { RedisPubSub } from "graphql-redis-subscriptions";

import Koa, { Context } from "koa";
import helmet from "koa-helmet";

import { PrismaClient } from "@prisma/client";

import { FETCH_DEPTH, generateJWT, getClaims, printError } from "./util";
import { Roles } from "./types";
import { createApollo } from "./apollo";

const {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NODE_ENV, REDIS_HOST, REDIS_PORT, CERT_FILE, KEY_FILE,
} = process.env;
let stopped = false;

const prisma = new PrismaClient();

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
  console.error(`redisClient error: ${err as string}`);
});

const wrightJWT = generateJWT({
  id: "theWright",
  email: "wright@writerite.site",
  roles: [Roles.wright],
  name: "The Wright",
});

function writeJWT(): void {
  if (stopped) {
    return;
  }
  redisClient.set("writerite:wright:jwt", wrightJWT)
    .then(() => setTimeout(writeJWT, 60000))
    .catch((e) => {
      throw new Error(`Unable to write writerite:wright:jwt : ${e as string}`);
    });
}
if (NODE_ENV !== "test") {
  writeJWT();
}

// Initialize express

const app = new Koa();

app.use(helmet());

const apollo = createApollo((ctx) => ({
  ctx: ctx as Context,
  fetchDepth: FETCH_DEPTH,
  sub: getClaims(ctx),
  prisma,
  pubsub,
  redisClient,
}));

apollo.applyMiddleware({
  app,
  cors: {
    origin: NODE_ENV === "production"
      ? "https://writerite.site"
      : "https://localhost:3000",
    credentials: true,
  },
});

export const server = CERT_FILE && KEY_FILE
  ? https.createServer({
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  }, app.callback())
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  : http.createServer(app.callback());

apollo.installSubscriptionHandlers(server);

server.listen({ port: 4000 }, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http${
    CERT_FILE && KEY_FILE ? "s" : ""
  }://localhost:${4000}${apollo.graphqlPath} in environment ${NODE_ENV as string}`);
});

export function stop(): void {
  stopped = true;
  server.removeAllListeners();
  server.close(printError);
  apollo.stop().catch(printError);
  pubsub.close();
  redisClient.removeAllListeners();
  redisClient.disconnect();
  prisma.disconnect().catch(printError);
}
