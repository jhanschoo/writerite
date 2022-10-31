import { Occupant, User } from '@prisma/client';
import { WillNotServeRoomStates } from '../room';

export type PrismaCurrentUserSourceType = User & {
  occupyingRooms: (Occupant & {
    room: {
      slug: string | null;
    };
  })[];
};

export const prismaIncludeForUserQueryForCurrentUser = {
  occupyingRooms: {
    include: {
      room: true,
    },
    where: {
      room: {
        state: { in: WillNotServeRoomStates },
      },
    },
  },
};
