/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { KJUR, hextob64 } from "jsrsasign";


export function generateB64UUID(): string {
	const uuid = KJUR.crypto.Util.getRandomHexOfNbits(128) as string;
	const b64uuid = hextob64(uuid) as string;
	return b64uuid;
}
