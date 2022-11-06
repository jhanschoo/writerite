import { mutationField, nonNull } from 'nexus';
import {
  currentUserSourceToCurrentUser,
  findOrCreateCurrentUserSourceWithProfile,
} from '../service/authentication';
import { currentUserToUserJWT, verifyStaleUserJWT } from '../service/userJWT';
import { jwtArg } from './scalarUtil';

// This is just a query, but needs to be a mutation field for technical reasons
export const RefreshMutation = mutationField('refresh', {
  type: 'JWT',
  args: {
    token: nonNull(jwtArg()),
  },
  async resolve(_parent, { token }, { prisma }) {
    try {
      const { sub } = await verifyStaleUserJWT(token);
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
