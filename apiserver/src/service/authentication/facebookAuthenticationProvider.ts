/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloError } from "apollo-server-koa";
import fetch from "node-fetch";

import env from "../../safeEnv";
import { AuthenticationProvider } from "./types";
import { userToJWT } from "./util";
import { Roles } from "../../types";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = env;
if (!FACEBOOK_APP_ID) {
	throw new Error("FACEBOOK_APP_ID envvar not found!");
}
if (!FACEBOOK_APP_SECRET) {
	throw new Error("FACEBOOK_APP_SECRET envvar not found!");
}

const FB_ACCESS_TOKEN_QUERY = `https://graph.facebook.com/oauth/access_token?client_id=${
	FACEBOOK_APP_ID
}&client_secret=${
	FACEBOOK_APP_SECRET
}&grant_type=client_credentials`;

const fbAccessTokenPromise = new Promise<string>((resolve) => {
	void fetch(FB_ACCESS_TOKEN_QUERY)
		.then((response) => response.json())
		.then((json) => resolve(json.access_token as string));
});

export const facebookAuthenticationProvider: AuthenticationProvider = {
	async signin({ prisma, email, name, token, identifier, persist }) {
		const facebookId = await this.verify(token);
		if (!facebookId || facebookId !== identifier) {
			throw new ApolloError("failed Facebook authentication");
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (user !== null) {
			if (facebookId !== user.facebookId) {
				throw new ApolloError("user already exists");
			}
			return userToJWT({ user, persist });
		}
		const newUser = await prisma.user.create({ data: {
			email,
			name,
			facebookId,
			roles: { set: [Roles.user] },
		} });
		return userToJWT({ user: newUser, persist });
	},
	async verify(token) {
		const fbAccessToken = await fbAccessTokenPromise;
		const VERIFY_URL = `https://graph.facebook.com/debug_token?input_token=${
			token
		}&access_token=${fbAccessToken}`;
		const response = await fetch(VERIFY_URL);
		const json = await response.json();
		if (json?.data?.app_id === FACEBOOK_APP_ID && json.data.is_valid && typeof json.data.user_id === "string") {
			return json.data.user_id;
		}
		return null;
	},
};
