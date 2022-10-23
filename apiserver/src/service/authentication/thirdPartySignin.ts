/* eslint-disable @typescript-eslint/naming-convention */
import type { PrismaClient, User } from "@prisma/client";
import { Roles } from "../../types";
import { getDevelopmentProfile } from "./getDevelopmentProfile";
import { getFacebookProfile } from "./getFacebookProfile";
import { getGoogleProfile } from "./getGoogleProfile";
import { ThirdPartyProfileInformation } from "./types";

const GOOGLE_PROVIDER = "google";
const FACEBOOK_PROVIDER = "facebook";
const DEVELOPMENT_PROVIDER = "development";

const providerStrategies = {
  [GOOGLE_PROVIDER]: [getGoogleProfile, "googleId"],
  [FACEBOOK_PROVIDER]: [getFacebookProfile, "facebookId"],
  [DEVELOPMENT_PROVIDER]: [getDevelopmentProfile, "name"],
} as const;

export async function thirdPartySignin({ code, provider, redirect_uri, prisma }: { code: string; provider: string; redirect_uri: string; prisma: PrismaClient }): Promise<User | null> {
  let profile: ThirdPartyProfileInformation | null = null;
  let user: User | null = null;
  if (Object.prototype.hasOwnProperty.call(providerStrategies, provider)) {
    const [getProfile, idField] = providerStrategies[provider as keyof typeof providerStrategies];
    profile = await getProfile({ code, redirect_uri });
    if (!profile) {
      return null;
    }
    user = await prisma.user.findUnique({ where: { [idField]: profile.id } });
    if (!user) {
      user = await prisma.user.create({ data: {
        [idField]: profile.id,
        roles: [Roles.User],
      } });
    }
  }
  if (!user) {
    return null;
  }
  return user;
}
