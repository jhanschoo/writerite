import { jwtVerify } from 'jose';
import { CurrentUser } from './CurrentUser';
import { PUBLIC_KEY_P, alg, issuer } from './constants';

export async function verifyUserJWT(jwt: string): Promise<CurrentUser> {
  const { payload } = await jwtVerify(jwt, await PUBLIC_KEY_P, { algorithms: [alg], issuer });
  return JSON.parse(payload.sub as string) as CurrentUser;
}
