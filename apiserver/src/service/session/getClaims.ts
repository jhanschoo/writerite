/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { YogaInitialContext } from 'graphql-yoga';
import { CurrentUser, verifyUserJWT } from '../userJWT';
import { handleError } from '../../util/handleError';
import Redis from 'ioredis';
import { isInvalidated } from './isInvalidated';

export async function getClaims(
  ctx: YogaInitialContext,
  redis: Redis
): Promise<CurrentUser | undefined> {
  const authorization =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ctx.request?.headers?.get?.('Authorization') ??
    // path if called from GraphiQL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx as any).extensions?.payload?.extensions?.headers?.Authorization ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx as any).extensions?.payload?.context?.fetchOptions?.headers?.Authorization;
  if (!authorization) {
    return;
  }

  const jwt = authorization.slice(7);
  if (jwt) {
    try {
      const { payload, sub } = await verifyUserJWT(jwt);
      if (await isInvalidated({ redis, payload, sub })) {
        return undefined;
      }
      return sub;
    } catch (e: unknown) {
      handleError(e);
      return undefined;
    }
  }
}
