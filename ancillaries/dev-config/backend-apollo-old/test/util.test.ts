import type { Context } from "koa";
import type { CurrentUser, IntegrationContext } from "../src/types";
import {
  comparePassword,
  generateB64UUID,
  generateJWT,
  getClaims,
  hashPassword,
} from "../src/util";

describe("getClaims", () => {
  test("getClaims returns undefined on bad context", () => {
    expect.assertions(1);
    expect(getClaims({})).toBeUndefined();
  });

  test("getClaims returns undefined on missing jwt", () => {
    expect.assertions(1);
    const sub = { hello: "world" };
    const ctx = { sub } as IntegrationContext;
    expect(getClaims(ctx)).toBeUndefined();
  });

  test("getClaims returns undefined if header not present", () => {
    expect.assertions(1);
    const ctx = { request: { get: () => undefined } } as IntegrationContext;
    expect(getClaims(ctx)).toBeUndefined();
  });

  test("getClaims returns undefined if Authorization header is malformed", () => {
    expect.assertions(1);
    const ctx = { ctx: { get: () => "abc" } as unknown as Context };
    expect(getClaims(ctx)).toBeUndefined();
  });
});

describe("JWTs", () => {
  test("generateJWT generates a JWT compatible with getClaims", () => {
    expect.assertions(1);
    const sub = { hello: "world" } as unknown as CurrentUser;
    const jwt = `Bearer ${generateJWT(sub)}`;
    expect(
      getClaims({
        ctx: {
          get: (headerKey: string) =>
            headerKey === "Authorization" ? jwt : undefined,
        } as unknown as Context,
      })
    ).toEqual(sub);
  });
});

describe("passwords", () => {
  test("comparePassword fails on malformed", async () => {
    expect.assertions(1);
    const passwordResultP = await comparePassword("123", "abc");
    expect(passwordResultP).toBe(false);
  });

  test("hashPassword generates a hash compatible with comparePassword", async () => {
    expect.assertions(1);
    const hash = await hashPassword("12345");
    const passwordResultP = await comparePassword("12345", hash);
    expect(passwordResultP).toBe(true);
  });
});

describe("generateB64UUID", () => {
  test("generateB64UUID generates distinct strings", () => {
    expect.assertions((31 * 32) / 2);
    const a: string[] = [];
    for (let i = 0; i < 32; ++i) {
      a[i] = generateB64UUID();
      for (let j = 0; j < i; ++j) {
        expect(a[i]).not.toBe(a[j]);
      }
    }
  });
});
