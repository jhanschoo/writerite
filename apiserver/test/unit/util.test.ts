/* eslint-disable @typescript-eslint/no-floating-promises */
import { YogaInitialContext } from "graphql-yoga";
import { getClaims } from "../../src/util";

describe("getClaims", () => {
  test("getClaims returns undefined on bad context", () => {
    expect.assertions(1);
    expect(getClaims({} as YogaInitialContext)).resolves.toBeUndefined();
  });

  test("getClaims returns undefined on missing jwt", () => {
    expect.assertions(1);
    const variables = { hello: "world" };
    const ctx = { headers: { variables } } as unknown as YogaInitialContext;
    expect(getClaims(ctx)).resolves.toBeUndefined();
  });

  test("getClaims returns undefined if header not present", () => {
    expect.assertions(1);
    const ctx = { request: { headers: { get: () => undefined } } } as unknown as YogaInitialContext;
    expect(getClaims(ctx)).resolves.toBeUndefined();
  });

  test("getClaims returns undefined if Authorization header is malformed", () => {
    expect.assertions(1);
    const ctx = { request: { headers: { get: () => "abc" } } } as unknown as YogaInitialContext;
    expect(getClaims(ctx)).resolves.toBeUndefined();
  });
});

