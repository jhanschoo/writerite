/* eslint-disable @typescript-eslint/naming-convention */
import { mutationField, nonNull, stringArg } from 'nexus';

import { getNonce, validateNonce } from '../service/crypto/nonce';
import { finalizeOauthSignin } from '../service/authentication/finalizeOauthSignin';
import { currentUserSourceToCurrentUser } from '../service/authentication/util';
import { currentUserToUserJWT } from '../service/userJWT';

const { NODE_ENV } = process.env;

export const InitializeOauthSigninMutation = mutationField('initializeOauthSignin', {
  type: nonNull('String'),
  resolve(_parent, _args, { redis }) {
    return getNonce(redis);
  },
});

export const FinalizeOauthSigninMutation = mutationField('finalizeOauthSignin', {
  type: 'SessionInfo',
  args: {
    code: nonNull(stringArg()),
    provider: nonNull(stringArg()),
    nonce: nonNull(stringArg()),
    redirect_uri: nonNull(stringArg()),
  },
  async resolve(_parent, { code, provider, nonce, redirect_uri }, { prisma, redis }) {
    if (NODE_ENV === 'production' && !(await validateNonce(redis, nonce))) {
      return null;
    }
    const user = await finalizeOauthSignin({ code, provider, redirect_uri, prisma });
    if (user) {
      const currentUser = currentUserSourceToCurrentUser(user);
      const token = await currentUserToUserJWT(currentUser);
      return {
        currentUser: currentUser as unknown as Record<string, unknown>,
        token,
      };
    }
    return null;
  },
});
