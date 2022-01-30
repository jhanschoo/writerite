import { OAuth2Client } from "google-auth-library";

import env from "../../safeEnv";
import { AuthenticationProvider } from "./types";
import { userToJWT } from "./util";
import { Roles } from "../../types";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { GAPI_CLIENT_ID, GAPI_CLIENT_SECRET } = env;
if (!GAPI_CLIENT_ID) {
	throw new Error("GAPI_CLIENT_ID envvar not found!");
}
if (!GAPI_CLIENT_SECRET) {
	throw new Error("GAPI_CLIENT_SECRET envvar not found!");
}

const gapiClient = new OAuth2Client(GAPI_CLIENT_ID);

export const googleAuthenticationProvider: AuthenticationProvider = {
	async signin({ prisma, email, name, token, identifier, persist }) {
		const googleId = await this.verify(token);
		if (!googleId || googleId !== identifier) {
			throw new Error("google auth: failed Google authentication");
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (user !== null) {
			if (googleId !== user.googleId) {
				throw new Error("user already exists");
			}
			return userToJWT({ user, persist });
		}
		const newUser = await prisma.user.create({ data: {
			email,
			name,
			googleId,
			roles: { set: [Roles.user] },
		} });
		return userToJWT({ user: newUser, persist });
	},
	async verify(idToken: string): Promise<string | null> {
		const ticket = await gapiClient.verifyIdToken({
			audience: GAPI_CLIENT_ID,
			idToken,
		});
		return ticket.getPayload()?.sub ?? null;
	},
};
