/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fetch from "node-fetch";
import FormData from "form-data";

import env from "../../safeEnv";
import { comparePassword, hashPassword } from "../../util";
import { AuthenticationProvider } from "./types";
import { ApolloError } from "apollo-server-koa";
import { userToJWT } from "./util";
import { Roles } from "../../types";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { RECAPTCHA_SECRET } = env;

if (!RECAPTCHA_SECRET) {
	throw new Error("RECAPTCHA_SECRET envvar not found!");
}

const recaptchaSecret = RECAPTCHA_SECRET;

export const localAuthenticationProvider: AuthenticationProvider = {
	async signin({ prisma, email, name, token, identifier: password, persist }) {
		const user = await prisma.user.findUnique({ where: { email } });
		if (user !== null) {
			if (!user.passwordHash || !await comparePassword(password, user.passwordHash)) {
				throw new ApolloError("local auth: failed login");
			}
			return userToJWT({ user, persist });
		}
		const verified = await this.verify(token);
		if (!verified) {
			throw new ApolloError("writerite: failed recaptcha authentication");
		}
		// create
		const passwordHash = await hashPassword(password);
		const newUser = await prisma.user.create({ data: {
			email,
			name,
			passwordHash,
			roles: { set: [Roles.user] },
		} });
		return userToJWT({ user: newUser, persist });
	},
	async verify(token) {
		const form = new FormData();
		form.append("secret", recaptchaSecret);
		form.append("response", token);

		const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "post",
			body: form,
		});

		// TODO: assert that hostname is correct
		const json = await response.json();
		return json.success ? "success" : null;
	},
};
