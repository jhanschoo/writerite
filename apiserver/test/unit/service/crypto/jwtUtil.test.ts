import { YogaInitialContext } from "@graphql-yoga/node";
import type { CurrentUser } from "../../../../src/types";
import { generateUserJWT } from "../../../../src/service/crypto/jwtUtil";
import { getClaims } from "../../../../src/util";

describe("JWTs", () => {
  test("generateUserJWT generates a JWT compatible with getClaims", () => {
    expect.assertions(1);
    const sub = { hello: "world" } as unknown as CurrentUser;
    const jwt = `Bearer ${generateUserJWT(sub)}`;
    expect(getClaims({
      request: {
        headers: {
          get: (headerKey: string) => headerKey === "Authorization" ? jwt : undefined,
        },
      },
    } as unknown as YogaInitialContext)).toEqual(sub);
  });
});
