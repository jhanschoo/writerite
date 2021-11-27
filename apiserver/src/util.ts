/* eslint-disable @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access */
import env from "./safeEnv";
import bcrypt from "bcrypt";
import { KEYUTIL, KJUR, hextob64 } from "jsrsasign";
import { nanoid } from "nanoid";

import { CurrentUser } from "./types";
import { IntegrationContext } from "./context";

const SALT_ROUNDS = 10;

export const FETCH_DEPTH = process.env.FETCH_DEPTH ? parseInt(process.env.FETCH_DEPTH, 10) : 3;
if (isNaN(FETCH_DEPTH) || FETCH_DEPTH < 1) {
	throw Error("envvar FETCH_DEPTH needs to be unset or a positive integer");
}

export function slug(size: number | null = 4): string {
	return nanoid(size ?? undefined);
}

const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = env;

const PRIVATE_KEY = KEYUTIL.getKey(JSON.parse(JWT_PRIVATE_KEY));
const PUBLIC_KEY = KEYUTIL.getKey(JSON.parse(JWT_PUBLIC_KEY));

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
	return bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, SALT_ROUNDS);
}

export function generateB64UUID(): string {
	const uuid = KJUR.crypto.Util.getRandomHexOfNbits(128) as string;
	const b64uuid = hextob64(uuid) as string;
	return b64uuid;
}

export function generateJWT(sub: CurrentUser, persist = false): string {
	const timeNow = KJUR.jws.IntDate.get("now") as number;
	const expiryTime = KJUR.jws.IntDate.get(persist ? "now + 1year" : "now + 1day") as number;

	const header = {
		alg: "ES256",
		cty: "JWT",
	} as const;

	const payload = {
		exp: expiryTime,
		iat: timeNow,
		iss: "writerite.site",
		jti: generateB64UUID(),
		// Nbf: timeNow,
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
			if (KJUR.jws.JWS.verify(jwt, PUBLIC_KEY, ["ES256"]) as boolean) {
				const { sub } = KJUR.jws.JWS.parse(jwt).payloadObj;
				return sub;
			}
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
