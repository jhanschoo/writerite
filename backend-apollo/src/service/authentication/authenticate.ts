import { PrismaClient } from "@prisma/client";
import { NexusGenArgTypes } from "../../../generated/nexus-typegen";
import { developmentAuthenticationProvider } from "./developmentAuthenticationProvider";
import { facebookAuthenticationProvider } from "./facebookAuthenticationProvider";
import { googleAuthenticationProvider } from "./googleAuthenticationProvider";
import { localAuthenticationProvider } from "./localAuthenticationProvider";

export function authenticate({ authorizer, ...opts }: NexusGenArgTypes["Mutation"]["signin"] & { prisma: PrismaClient }): Promise<string | null> {
	// workaround for undefinedOnly annotation not being implemented
	const providerOpts = {
		...opts,
		name: opts.name as string | undefined,
		persist: opts.persist as boolean | undefined,
	};
	switch (authorizer.toUpperCase()) {
		case "GOOGLE":
			return googleAuthenticationProvider.signin(providerOpts);
		case "FACEBOOK":
			return facebookAuthenticationProvider.signin(providerOpts);
		case "LOCAL":
			return localAuthenticationProvider.signin(providerOpts);
		case "DEVELOPMENT":
			return developmentAuthenticationProvider.signin(providerOpts);
		default:
			return Promise.resolve(null);
	}
}
