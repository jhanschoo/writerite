import { JWTPayload, jwtVerify } from 'jose';
import { CurrentUser } from './CurrentUser';
import { PUBLIC_KEY_P, alg, issuer } from './constants';

export async function verifyUserJWT(
  jwt: string,
  clockTolerance?: number
): Promise<{ payload: JWTPayload; sub: CurrentUser }> {
  const { payload } = await jwtVerify(jwt, await PUBLIC_KEY_P, {
    algorithms: [alg],
    issuer,
    clockTolerance,
  });
  return { payload, sub: JSON.parse(payload.sub as string) as CurrentUser };
}
