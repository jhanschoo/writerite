import {
  comparePassword,
  hashPassword,
} from "../../../../src/service/crypto/passwordUtil";

describe("service/crypto/passwordUtil.ts", () => {
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
