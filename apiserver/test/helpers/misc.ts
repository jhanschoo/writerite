import { PrismaClient } from "@prisma/client";
import { PubSubEngine } from "graphql-subscriptions";
import Redis from "ioredis";
import { KJUR } from "jsrsasign";
import { Context, ContextFactoryReturnType, contextFactory } from "../../src/context";
import { CurrentUser } from "../../src/types";


export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return KJUR.jws.JWS.parse(jwt).payloadObj.sub as CurrentUser;
}

export function testContextFactory<T extends PrismaClient, U extends PubSubEngine, R extends Redis.Redis>(opts?: Partial<Context<T, U, R>> & Pick<Context<T, U, R>, "prisma" | "pubsub" | "redis">): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType<T, U, R>];
export function testContextFactory(opts?: Partial<Context>): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType];
export function testContextFactory(opts?: Partial<Context>): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType] {
	let sub: CurrentUser | undefined;
	return [
		(newSub) => {
			sub = newSub;
		},
		...contextFactory(opts, () => sub),
	];
}
