/* eslint-disable @typescript-eslint/naming-convention */
import type { PrismaClient } from '@prisma/client';
import { ProviderKey, providerStrategies } from './providerStrategies';
import { PrismaCurrentUserSourceType } from './types';
import { findOrCreateCurrentUserSourceWithProfile } from './util';


export async function finalizeOauthSignin({
  code,
  provider,
  redirect_uri,
  prisma,
}: {
  code: string;
  provider: string;
  redirect_uri: string;
  prisma: PrismaClient;
}): Promise<PrismaCurrentUserSourceType | null> {
  if (!Object.prototype.hasOwnProperty.call(providerStrategies, provider)) {
    return null;
  }
  const [getProfile, idField] = providerStrategies[provider as ProviderKey];
  const profile = await getProfile({ code, redirect_uri });
  if (!profile) {
    return null;
  }
  const user = await findOrCreateCurrentUserSourceWithProfile(prisma, profile.id, idField);
  return user;
}
