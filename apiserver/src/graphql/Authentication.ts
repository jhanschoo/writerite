/* eslint-disable @typescript-eslint/naming-convention */
import { mutationField, nonNull, stringArg } from "nexus";

import { getNonce, validateNonce } from "../service/crypto/nonce";
import { thirdPartySignin } from "../service/authentication/thirdPartySignin";
import { userToJWT } from "../service/authentication/util";

export const InitializeThirdPartySigninMutation = mutationField("initializeThirdPartyOauthSignin", {
	type: nonNull("String"),
	resolve(_parent, _args, { redis }) {
		return getNonce(redis);
	},
});

export const FinalizeThirdPartySigninMutation = mutationField("finalizeThirdPartyOauthSignin", {
	type: "JWT",
	args: {
		code: nonNull(stringArg()),
		provider: nonNull(stringArg()),
		nonce: nonNull(stringArg()),
		redirect_uri: nonNull(stringArg()),
	},
	async resolve(_parent, { code, provider, nonce, redirect_uri }, { prisma, redis }) {
		if (!await validateNonce(redis, nonce)) {
			return null;
		}
		const user = await thirdPartySignin({ code, provider, redirect_uri, prisma });
		return user && userToJWT({ user, persist: true });
	},
});
