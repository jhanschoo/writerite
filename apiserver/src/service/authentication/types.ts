import { Occupant, User } from '@prisma/client';

// following are not meant for service-external use
export type PrismaCurrentUserSourceType = User & {
  occupyingRooms: (Occupant & {
    room: {
      id: string;
      slug: string | null;
    };
  })[];
};
