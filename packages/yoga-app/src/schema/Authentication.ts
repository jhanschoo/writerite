import { builder } from '../builder';
import env from '../safeEnv';
import { finalizeOauthSignin } from '../service/authentication/finalizeOauthSignin';
import { currentUserSourceToCurrentUser } from '../service/authentication/util';
import { getNonce, validateNonce } from '../service/crypto/nonce';
import { currentUserToUserJWT } from '../service/userJWT';
import { SessionInfo } from './Session';
import { FinalizeOauthSigninMutationInput } from './inputs';

const { NODE_ENV } = env;

builder.mutationField('initializeOauthSignin', (t) =>
  t.field({
    type: 'String',
    resolve(_parent, _args, { redis }) {
      return getNonce(redis);
    },
  })
);

builder.mutationField('finalizeOauthSignin', (t) =>
  t.field({
    type: SessionInfo,
    nullable: true,
    args: {
      input: t.arg({ type: FinalizeOauthSigninMutationInput, required: true }),
    },
    async resolve(
      _parent,
      { input: { code, provider, nonce, redirect_uri } },
      { prisma, redis }
    ) {
      if (NODE_ENV === 'production' && !(await validateNonce(redis, nonce))) {
        return null;
      }
      const user = await finalizeOauthSignin({
        code,
        provider,
        redirect_uri,
        prisma,
      });
      if (user) {
        const currentUser = currentUserSourceToCurrentUser(user);
        const token = await currentUserToUserJWT(currentUser);
        return new SessionInfo(token, currentUser);
      }
      return null;
    },
  })
);
