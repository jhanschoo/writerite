import { Roles } from '../userJWT/Roles';
import { PrismaCurrentUserSourceType } from './types';
import { WillNotServeRoomStates } from '../room';
import { PrismaClient } from '@prisma/client';
import { ProviderPrismaFieldKeys } from './providerStrategies';
import type { CurrentUser } from '../userJWT/CurrentUser';

export function currentUserSourceToCurrentUser({
  id,
  name,
  roles,
  occupyingRooms,
}: PrismaCurrentUserSourceType): CurrentUser {
  const occupyingActiveRoomSlugs: Record<string, string> = {};
  for (const {
    room: { id: roomId, slug },
  } of occupyingRooms) {
    if (slug) {
      occupyingActiveRoomSlugs[slug] = roomId;
    }
  }
  return {
    id,
    name,
    roles: roles as Roles[],
    occupyingActiveRoomSlugs,
  };
}

export const findOrCreateCurrentUserSourceWithProfile = async (
  prisma: PrismaClient,
  profileId: string,
  idField: ProviderPrismaFieldKeys
) => {
  // Note: this include should behave identically to the User.occupyingActiveRooms field
  const include = {
    occupyingRooms: {
      include: {
        room: true,
      },
      where: {
        room: {
          state: { notIn: WillNotServeRoomStates },
        },
      },
    },
  };
  const user = await prisma.user.upsert({
    // Note that this coerced type is benignly more strict than expected
    where: { [idField]: profileId } as { [K in ProviderPrismaFieldKeys]: string },
    update: {},
    create: {
      [idField]: profileId,
      roles: [Roles.User],
    },
    include,
  });
  return user;
};
