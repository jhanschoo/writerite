/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { YogaInitialContext } from "graphql-yoga";
import { CurrentUser, verifyUserJWT } from "../service/userJWT";
import { handleError } from "./handleError";

export async function getClaims(ctx: YogaInitialContext): Promise<CurrentUser | undefined> {
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
      return await verifyUserJWT(jwt);
    } catch (e: unknown) {
      handleError(e);
      return undefined;
    }
  }
}
