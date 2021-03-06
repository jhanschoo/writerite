import { PrismaClient, Unit } from 'database';

import type { CurrentUser } from '../userJWT/CurrentUser';
import { Roles } from '../userJWT/Roles';
import { ProviderPrismaFieldKeys } from './providerStrategies';
import { PrismaCurrentUserSourceType } from './types';

export function currentUserSourceToCurrentUser({
  id,
  name,
  roles,
  occupyingRooms,
}: PrismaCurrentUserSourceType): CurrentUser {
  const occupyingRoomSlugs: Record<string, string | null> = {};
  for (const {
    room: { id: roomId, rounds },
  } of occupyingRooms) {
    occupyingRoomSlugs[roomId] = rounds[0]?.slug ?? null;
  }
  return {
    bareId: id,
    name,
    roles: roles as Roles[],
    occupyingRoomSlugs,
  };
}

export const findOrCreateCurrentUserSourceWithProfile = async (
  prisma: PrismaClient,
  profileId: string,
  idField: ProviderPrismaFieldKeys,
  name?: string
) => {
  const user = await prisma.user.upsert({
    // Note that this coerced type is benignly more strict than expected
    where: { [idField]: profileId } as {
      [K in ProviderPrismaFieldKeys]: string;
    },
    update: {},
    create: {
      [idField]: profileId,
      name: name ?? 'New User',
      roles: [Roles.User],
    },
    include: {
      occupyingRooms: {
        include: {
          room: {
            include: {
              rounds: {
                where: {
                  isActive: Unit.UNIT,
                },
                select: {
                  slug: true,
                },
              },
            },
          },
        },
        where: {
          room: {
            archived: false,
          },
        },
      },
    },
  });
  return user;
};
