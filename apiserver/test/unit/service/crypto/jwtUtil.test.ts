import { YogaInitialContext } from "@graphql-yoga/node";
import type { CurrentUser } from "../../../../src/types";
import { generateJWT } from "../../../../src/service/crypto/jwtUtil";
import { getClaims } from "../../../../src/util";

describe("JWTs", () => {
	test("generateJWT generates a JWT compatible with getClaims", () => {
		expect.assertions(1);
		const sub = { hello: "world" } as unknown as CurrentUser;
		const jwt = `Bearer ${generateJWT(sub)}`;
		expect(getClaims({
			request: {
				get: (headerKey: string) => headerKey === "Authorization" ? jwt : undefined,
			},
		} as unknown as YogaInitialContext)).toEqual(sub);
	});
});
