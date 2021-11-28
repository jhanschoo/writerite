import env from "./safeEnv";
import { ContextFunction } from "apollo-server-core";
import { Context as KoaContext } from "koa";
import { PubSubEngine } from "graphql-subscriptions";
// import { ExecutionParams } from "subscriptions-transport-ws";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { PrismaClient } from "@prisma/client";

import { FETCH_DEPTH, getClaims } from "./util";
import { CurrentUser, Roles } from "./types";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

const redisOptions = {
	host: REDIS_HOST,
	port: parseInt(REDIS_PORT, 10),
	retryStrategy: (times: number): number => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
	password: REDIS_PASSWORD,
};

export interface IntegrationContext {
	ctx?: KoaContext;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	// connection?: ExecutionParams<{ Authorization?: string }>;
}

export interface AuthorizationHelpers {
	isLoggedInAs(id: string): boolean;
	get isAdmin(): boolean;
}

export interface Context {
	ctx: IntegrationContext;
	fetchDepth: number;
	sub?: CurrentUser;
	prisma: PrismaClient;
	pubsub: PubSubEngine;
	auth: AuthorizationHelpers;
}

export interface LoggedInContext extends Context {
	sub: CurrentUser;
}

/**
 * Note: opts.ctx is never used if provided
 * @returns An array where the first element is the context function, and the second is a handler to close all services opened by this particular call, and the third is a debug object containing direct references to the underlying services.
 */
export function contextFactory(opts?: Partial<Context>, subFn?: (ctx: IntegrationContext) => CurrentUser | undefined): [ContextFunction, () => Promise<PromiseSettledResult<unknown>[]>, { prisma: PrismaClient, pubsub: PubSubEngine }] {
	const useDefaultPrisma = !opts?.prisma;
	const useDefaultPubsub = !opts?.pubsub;
	const publisher = new Redis({ ...redisOptions, db: 2 });
	const subscriber = new Redis({ ...redisOptions, db: 2 });
	publisher.on("connect", () => {
		// eslint-disable-next-line no-console
		console.log(`publisher connected to redis db 2 at host ${redisOptions.host} and port ${redisOptions.port}`);
	});
	subscriber.on("connect", () => {
		// eslint-disable-next-line no-console
		console.log(`subscriber connected to redis db 2 at host ${redisOptions.host} and port ${redisOptions.port}`);
	});
	const prisma = opts?.prisma ?? new PrismaClient();
	const pubsub = opts?.pubsub ?? new RedisPubSub({
		publisher,
		subscriber,
	});
	return [
		(ctx: IntegrationContext): Context => {
			const sub = subFn?.(ctx) ?? opts?.sub ?? getClaims(ctx);
			return {
				ctx,
				fetchDepth: opts?.fetchDepth ?? FETCH_DEPTH,
				sub,
				prisma,
				pubsub,
				auth: {
					isLoggedInAs(id: string): boolean {
						return sub?.id === id;
					},
					get isAdmin(): boolean {
						return Boolean(sub?.roles.includes(Roles.admin));
					},
				},
			};
		},
		async () => Promise.allSettled([
			useDefaultPrisma ? prisma.$disconnect() : Promise.resolve("custom prisma used"),
			useDefaultPubsub ? (pubsub as RedisPubSub).close() : Promise.resolve("custom pubsub used"),
		]),
		{ prisma, pubsub },
	];
}
