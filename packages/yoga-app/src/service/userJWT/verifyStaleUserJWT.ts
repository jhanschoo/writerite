import { JWTPayload } from 'jose';

import { CurrentUser } from './CurrentUser';
import { verifyUserJWT } from './verifyUserJWT';

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export function verifyStaleUserJWT(
  jwt: string
): Promise<{ payload: JWTPayload; sub: CurrentUser }> {
  return verifyUserJWT(jwt, ONE_WEEK_IN_SECONDS);
}
