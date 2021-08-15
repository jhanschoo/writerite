import env from "./safeEnv";
import { ContextFunction } from "apollo-server-core";
import { PubSubEngine } from "apollo-server-koa";
import { Context as KoaContext } from "koa";
import { ExecutionParams } from "subscriptions-transport-ws";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { PrismaClient } from "@prisma/client";

import { FETCH_DEPTH, getClaims, handleError } from "./util";
import { CurrentUser } from "./types";

const { REDIS_HOST, REDIS_PORT } = env;

const prisma = new PrismaClient();

// Initialize redis connection

const redisOptions = {
	host: REDIS_HOST,
	port: parseInt(REDIS_PORT, 10),
	retryStrategy: (times: number): number => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
};

export const pubsub = new RedisPubSub({
	publisher: new Redis({ ...redisOptions, db: 2 }),
	subscriber: new Redis({ ...redisOptions, db: 2 }),
});

export interface IntegrationContext {
	ctx?: KoaContext;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	connection?: ExecutionParams<{ Authorization?: string }>;
}

export interface Context {
	ctx: IntegrationContext;
	fetchDepth: number;
	sub?: CurrentUser;
	prisma: PrismaClient;
	pubsub: PubSubEngine;
}

export const context: ContextFunction = (ctx: IntegrationContext): Context => ({
	ctx,
	fetchDepth: FETCH_DEPTH,
	sub: getClaims(ctx),
	prisma,
	pubsub,
});

export function stopContextServices(): void {
	void pubsub.close();
	prisma.$disconnect().catch(handleError);
}
