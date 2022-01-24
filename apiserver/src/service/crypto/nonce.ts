import { KJUR } from "jsrsasign";
import type Redis from "ioredis";

const oneMinute = 60;
const namespace = "nonce";
const OK = "OK";

export async function getNonce(redis: Redis.Redis): Promise<string> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	const nonce = KJUR.crypto.Util.getRandomHexOfNbytes(4) as string;
	await redis.setex(`${namespace}:${nonce}`, oneMinute, OK);
	return nonce;
}

export async function validateNonce(redis: Redis.Redis, nonce: string): Promise<boolean> {
	return await redis.get(`${namespace}:${nonce}`) === OK;
}
