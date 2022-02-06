/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import env from "../../safeEnv";
import { KEYUTIL, KJUR } from "jsrsasign";
import { CurrentUser } from "../../types";
import { generateB64UUID } from "./generateB64UUID";

const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = env;

const PRIVATE_KEY = KEYUTIL.getKey(JSON.parse(JWT_PRIVATE_KEY));
const PUBLIC_KEY = KEYUTIL.getKey(JSON.parse(JWT_PUBLIC_KEY));

const alg = "ES256";

export function generateUserJWT(sub: CurrentUser, persist = false): string {
	const timeNow = KJUR.jws.IntDate.get("now") as number;
	const expiryTime = KJUR.jws.IntDate.get(persist ? "now + 1year" : "now + 1day") as number;

	const header = {
		alg,
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

	return KJUR.jws.JWS.sign(null, header, payload, PRIVATE_KEY) as string;
}

export function verifyJWT(jwt: string): boolean {
	return KJUR.jws.JWS.verify(jwt, PUBLIC_KEY, [alg]) as boolean;
}

export function parseJWT(jwt: string): unknown {
	return KJUR.jws.JWS.parse(jwt).payloadObj;
}
