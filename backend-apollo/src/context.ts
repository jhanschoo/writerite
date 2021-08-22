import env from "./safeEnv";
import { ContextFunction } from "apollo-server-core";
import { PubSubEngine } from "apollo-server-koa";
import { Context as KoaContext } from "koa";
import { ExecutionParams } from "subscriptions-transport-ws";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { PrismaClient } from "@prisma/client";

import { FETCH_DEPTH, getClaims } from "./util";
import { CurrentUser } from "./types";

const { REDIS_HOST, REDIS_PORT } = env;

const redisOptions = {
	host: REDIS_HOST,
	port: parseInt(REDIS_PORT, 10),
	retryStrategy: (times: number): number => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
};

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

/**
 * Note: opts.ctx is never used if provided
 * @returns An array where the first element is the context function, and the second is a handler to close all services opened by this particular call, and the third is a debug object containing direct references to the underlying services.
 */
export function contextFactory(opts?: Partial<Context>, subFn?: (ctx: IntegrationContext) => CurrentUser | undefined): [ContextFunction, () => Promise<PromiseSettledResult<unknown>[]>, { prisma: PrismaClient, pubsub: PubSubEngine }] {
	const useDefaultPrisma = !opts?.prisma;
	const useDefaultPubsub = !opts?.pubsub;
	const prisma = opts?.prisma ?? new PrismaClient();
	const pubsub = opts?.pubsub ?? new RedisPubSub({
		publisher: new Redis({ ...redisOptions, db: 2 }),
		subscriber: new Redis({ ...redisOptions, db: 2 }),
	});
	return [
		(ctx: IntegrationContext): Context => ({
			ctx,
			fetchDepth: opts?.fetchDepth ?? FETCH_DEPTH,
			sub: subFn?.(ctx) ?? opts?.sub ?? getClaims(ctx),
			prisma,
			pubsub,
		}),
		async () => Promise.allSettled([
			useDefaultPrisma ? prisma.$disconnect() : Promise.resolve("custom prisma used"),
			useDefaultPubsub ? (pubsub as RedisPubSub).close() : Promise.resolve("custom pubsub used"),
		]),
		{ prisma, pubsub },
	];
}
