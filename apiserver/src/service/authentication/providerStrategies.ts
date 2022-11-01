import { User } from '@prisma/client';
import {
  ExternalProfileInformationProvider,
  getDevelopmentProfile,
  getFacebookProfile,
  getGoogleProfile,
} from './profileProviders';

const FACEBOOK_PROVIDER = 'facebook';
const GOOGLE_PROVIDER = 'google';
const DEVELOPMENT_PROVIDER = 'development';
const DUMMY_ID_PROVIDER = 'id';

export type ProviderKey =
  | typeof FACEBOOK_PROVIDER
  | typeof GOOGLE_PROVIDER
  | typeof DEVELOPMENT_PROVIDER
  | typeof DUMMY_ID_PROVIDER;

export type ProviderPrismaFieldKeys = keyof Pick<User, 'facebookId' | 'googleId' | 'name' | 'id'>;

// We generalize the type of `providerStrategies` in this way (losing type information about the particular key to value maps) for ease in inference.
export const providerStrategies: {
  [K in ProviderKey]: [ExternalProfileInformationProvider, ProviderPrismaFieldKeys];
} = {
  google: [getGoogleProfile, 'googleId'],
  facebook: [getFacebookProfile, 'facebookId'],
  development: [getDevelopmentProfile, 'name'],
  id: [() => Promise.resolve(null), 'id'],
};