import { KJUR } from "jsrsasign";
import { contextFactory } from "../src/context";
import { CurrentUser } from "../src/types";


export function unsafeJwtToCurrentUser(jwt: string): CurrentUser {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return KJUR.jws.JWS.parse(jwt).payloadObj.sub as CurrentUser;
}

export function testContextFactory(): [(sub?: CurrentUser) => void, ...ReturnType<typeof contextFactory>] {
	let sub: CurrentUser | undefined;
	return [
		(newSub) => {
			sub = newSub;
		},
		...contextFactory(undefined, () => sub),
	];
}
