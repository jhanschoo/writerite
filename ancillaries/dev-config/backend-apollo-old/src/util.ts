/* eslint-disable @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access */
import "./assertConfig";
import bcrypt from "bcrypt";
import { KEYUTIL, KJUR, hextob64 } from "jsrsasign";
import randomWords from "random-words";

import { CurrentUser, IntegrationContext } from "./types";

const SALT_ROUNDS = 10;

export const FETCH_DEPTH = process.env.FETCH_DEPTH ? parseInt(process.env.FETCH_DEPTH, 10) : 3;
if (isNaN(FETCH_DEPTH) || FETCH_DEPTH < 1) {
  throw Error("envvar FETCH_DEPTH needs to be unset or a positive integer");
}

export function randomThreeWords(): string {
  return randomWords({
    exactly: 1, wordsPerString: 3, separator: "-",
  })[0] as string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = process.env;

const PRIVATE_KEY = KEYUTIL.getKey(JSON.parse(JWT_PRIVATE_KEY ?? "fail"));
const PUBLIC_KEY = KEYUTIL.getKey(JSON.parse(JWT_PUBLIC_KEY ?? "fail"));

export function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function generateB64UUID(): string {
  const uuid = KJUR.crypto.Util.getRandomHexOfNbits(128);
  const b64uuid = hextob64(uuid);
  return b64uuid;
}

export function generateJWT(sub: CurrentUser, persist = false): string {
  const timeNow = KJUR.jws.IntDate.get("now");
  const expiryTime = KJUR.jws.IntDate.get(persist ? "now + 1year" : "now + 1day",);

  const header = {
    alg: "ES256",
    cty: "JWT",
  };

  const payload = {
    exp: expiryTime,
    iat: timeNow,
    iss: "writerite.site",
    jti: generateB64UUID(),
    // nbf: timeNow,
    sub,
  };

  const jwt = KJUR.jws.JWS.sign(null, header, payload, PRIVATE_KEY) as string;
  return jwt;
}

export function getClaims(ctx: IntegrationContext): CurrentUser | undefined {
  const authorization = ctx.ctx?.get("Authorization") ?? ctx.connection?.context.Authorization ?? null;
  if (!authorization) {
    return;
  }
  const jwt = authorization.slice(7);
  if (jwt) {
    try {
      if (KJUR.jws.JWS.verify(jwt, PUBLIC_KEY, ["ES256"])) {
        const sub = KJUR.jws.JWS.parse(jwt)
          .payloadObj.sub as CurrentUser;
        return sub;
      }
    } catch (e) {
      handleError(e);
      return undefined;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function handleError(e: any): null {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
  return null;
}
