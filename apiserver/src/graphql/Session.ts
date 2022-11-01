import { nonNull, queryField } from 'nexus';
import {
  currentUserSourceToCurrentUser,
  findOrCreateCurrentUserSourceWithProfile,
} from '../service/authentication';
import { currentUserToUserJWT, verifyStaleUserJWT } from '../service/userJWT';
import { jwtArg } from './scalarUtil';

export const RefreshQuery = queryField('refresh', {
  type: 'JWT',
  args: {
    token: nonNull(jwtArg()),
  },
  async resolve(_parent, { token }, { prisma }) {
    try {
      const { sub } = await verifyStaleUserJWT(token as string);
      const currentUserSource = await findOrCreateCurrentUserSourceWithProfile(
        prisma,
        sub.id,
        'id'
      );
      const currentUser = currentUserSourceToCurrentUser(currentUserSource);
      return await currentUserToUserJWT(currentUser);
    } catch (e) {
      return null;
    }
  },
});
