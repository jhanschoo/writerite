import { User } from "@prisma/client";
import { ExternalProfileInformationProvider, getDevelopmentProfile, getFacebookProfile, getGoogleProfile } from "./profileProviders";

const FACEBOOK_PROVIDER = 'facebook';
const GOOGLE_PROVIDER = 'google';
const DEVELOPMENT_PROVIDER = 'development';

export type ProviderKey =
  | typeof FACEBOOK_PROVIDER
  | typeof GOOGLE_PROVIDER
  | typeof DEVELOPMENT_PROVIDER
  ;

export type ProviderPrismaFieldKeys = keyof Pick<User, 'facebookId' | 'googleId' | 'name'>

// We generalize the type of `providerStrategies` in this way (losing type information about the particular key to value maps) for ease in inference.
export const providerStrategies: { [K in ProviderKey]: [ExternalProfileInformationProvider, ProviderPrismaFieldKeys] } = {
  google: [getGoogleProfile, 'googleId'],
  facebook: [getFacebookProfile, 'facebookId'],
  development: [getDevelopmentProfile, 'name'],
};
