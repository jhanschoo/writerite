/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import env from '../../safeEnv';
import { JWTPayload, SignJWT, decodeJwt, importJWK, jwtVerify } from 'jose';
import { CurrentUser } from '../../types';
import { nanoid } from 'nanoid';

const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = env;

const alg = 'ES256';
const issuer = 'writerite.site';

const PRIVATE_KEY_P = importJWK(JWT_PRIVATE_KEY, alg);
const PUBLIC_KEY_P = importJWK(JWT_PUBLIC_KEY, alg);

export async function generateUserJWT(sub: CurrentUser, persist = false): Promise<string> {
  return new SignJWT({ sub: JSON.stringify(sub) })
    .setProtectedHeader({ alg, cty: 'JWT' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(persist ? '1year' : '1day')
    .setJti(nanoid())
    .sign(await PRIVATE_KEY_P);
}

export async function verifyUserJWT(jwt: string): Promise<CurrentUser> {
  const { payload } = await jwtVerify(jwt, await PUBLIC_KEY_P, { algorithms: [alg], issuer });
  return JSON.parse(payload.sub as string) as CurrentUser;
}

export function parseArbitraryJWT<T extends JWTPayload>(jwt: string): T {
  return decodeJwt(jwt) as T;
}
