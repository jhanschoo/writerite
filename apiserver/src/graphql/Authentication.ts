import { booleanArg, mutationField, nonNull, stringArg } from "nexus";
import { authenticate } from "../service/authentication/authenticate";
import { getNonce, validateNonce } from "../service/crypto/nonce";

export const SigninMutation = mutationField("signin", {
	type: "JWT",
	args: {
		email: nonNull(stringArg()),
		name: stringArg({ undefinedOnly: true }),
		token: nonNull(stringArg()),
		authorizer: nonNull(stringArg()),
		identifier: nonNull(stringArg()),
		persist: booleanArg({ undefinedOnly: true }),
	},
	resolve(_parent, args, { prisma }) {
		return authenticate({ ...args, prisma });
	},
});

export const InitializeThirdPartySigninMutation = mutationField("initializeThirdPartyOauthSignin", {
	type: nonNull("String"),
	resolve(_parent, _args, { redis }) {
		return getNonce(redis);
	},
});

export const FinalizeThirdPartySigninMutation = mutationField("finalizeThirdPartyOauthSignin", {
	type: "JWT",
	args: {
		nonce: nonNull(stringArg()),
	},
	async resolve(_parent, { nonce }, { redis }) {
		await validateNonce(redis, nonce);
		return null;
	},
});
