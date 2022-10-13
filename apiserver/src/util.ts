/* eslint-disable @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument
 */
import { nanoid } from "nanoid";
import { YogaInitialContext } from "@graphql-yoga/node";

import { CurrentUser } from "./types";
import { verifyUserJWT } from "./service/crypto/jwtUtil";
// eslint-disable-next-line @typescript-eslint/no-shadow
import { URL } from "url";

export const FETCH_DEPTH = process.env.FETCH_DEPTH ? parseInt(process.env.FETCH_DEPTH, 10) : 3;
if (isNaN(FETCH_DEPTH) || FETCH_DEPTH < 1) {
  throw Error("envvar FETCH_DEPTH needs to be unset or a positive integer");
}

export function slug(size: number | null = 4): string {
  return nanoid(size ?? undefined);
}

export async function getClaims(ctx: YogaInitialContext): Promise<CurrentUser | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const authorization = ctx.request?.headers?.get("Authorization") ??
  // path if called from GraphiQL
  ctx.extensions?.payload?.extensions?.headers?.Authorization ??
  ctx.extensions?.payload?.context?.fetchOptions?.headers?.Authorization;
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

export function handleError(e: unknown): null {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }

  return null;
}

export function setSearchParams(url: URL, params: { [key: string]: string }): URL {
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  return url;
}
