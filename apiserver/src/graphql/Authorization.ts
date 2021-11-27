import { booleanArg, mutationField, nonNull, stringArg } from "nexus";
import { authenticate } from "../service/authentication/authenticate";

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
