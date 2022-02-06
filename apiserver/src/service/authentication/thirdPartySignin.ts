/* eslint-disable @typescript-eslint/naming-convention */
import type { PrismaClient, User } from "@prisma/client";
import { Roles } from "../../types";
import { getFacebookProfile } from "./getFacebookProfile";
import { getGoogleProfile } from "./getGoogleProfile";
import { ThirdPartyProfileInformation } from "./types";

const GOOGLE_PROVIDER = "google";
const FACEBOOK_PROVIDER = "facebook";

export async function thirdPartySignin({ code, provider, redirect_uri, prisma }: { code: string; provider: string; redirect_uri: string; prisma: PrismaClient }): Promise<User | null> {
	let profile: ThirdPartyProfileInformation | null = null;
	let user: User | null = null;
	switch (provider) {
		case GOOGLE_PROVIDER:
			profile = await getGoogleProfile({ code, redirect_uri });
			if (!profile) {
				return null;
			}
			user = await prisma.user.findUnique({ where: { googleId: profile.id } });
			if (!user) {
				user = await prisma.user.create({
					data: {
						googleId: profile.id,
						email: profile.email,
						roles: [Roles.user],
					},
				});
			}
			break;
		case FACEBOOK_PROVIDER:
			profile = await getFacebookProfile({ code, redirect_uri });
			if (!profile) {
				return null;
			}
			user = await prisma.user.findUnique({ where: { facebookId: profile.id } });
			if (!user) {
				user = await prisma.user.create({
					data: {
						facebookId: profile.id,
						email: profile.email,
						roles: [Roles.user],
					},
				});
			}
			break;
		default:
			break;
	}
	if (!user) {
		return null;
	}
	return user;
}
