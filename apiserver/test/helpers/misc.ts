import { PrismaClient } from "@prisma/client";
import { PubSubEngine } from "graphql-subscriptions";
import { KJUR } from "jsrsasign";
import { Context, contextFactory, ContextFactoryReturnType } from "../../src/context";
import { CurrentUser } from "../../src/types";


export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return KJUR.jws.JWS.parse(jwt).payloadObj.sub as CurrentUser;
}

export function testContextFactory<T extends PrismaClient, U extends PubSubEngine>(opts?: Partial<Context<T, U>> & Pick<Context<T, U>, "prisma" | "pubsub">): [(sub?: CurrentUser) => void, ...ContextFactoryReturnType<T, U>];
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
