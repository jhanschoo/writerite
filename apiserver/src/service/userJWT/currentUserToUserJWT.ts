import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { CurrentUser } from './CurrentUser';
import { PRIVATE_KEY_P, alg, issuer, ttlInSeconds } from './constants';

export async function currentUserToUserJWT(
  sub: CurrentUser,
  expInSeconds: number = ttlInSeconds
): Promise<string> {
  return new SignJWT({ sub: JSON.stringify(sub) })
    .setProtectedHeader({ alg, cty: 'JWT' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(`${expInSeconds}s`)
    .setJti(nanoid())
    .sign(await PRIVATE_KEY_P);
}
