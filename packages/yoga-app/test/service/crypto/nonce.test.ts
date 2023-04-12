import Redis from "ioredis";
import { DeepMockProxy, any, mockDeep, mockReset } from "jest-mock-extended";
import { getNonce, validateNonce } from "../../../src/service/crypto/nonce";

describe("service/crypto/nonce.ts", () => {
  let redis: DeepMockProxy<Redis>;

  beforeAll(() => {
    redis = mockDeep<Redis>();
  });

  beforeEach(() => {
    mockReset(redis);
  });

  describe("getNonce", () => {
    it("should be able to get a nonce", async () => {
      expect.assertions(3);
      redis.setex.calledWith(any(), any(), any()).mockResolvedValue("OK");
      const nonce = await getNonce(redis);
      expect(nonce).toHaveLength(4);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(redis.setex).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(redis.setex).toHaveBeenLastCalledWith(`nonce:${nonce}`, 60, "OK");
    });
  });

  describe("validateNonce", () => {
    it("should return true for a valid nonce", async () => {
      expect.assertions(1);
      const nonce = "12345678";
      redis.get.calledWith(`nonce:${nonce}`).mockResolvedValue("OK");
      const valid = await validateNonce(redis, nonce);
      expect(valid).toBe(true);
    });
    it("should return false for an invalid nonce", async () => {
      expect.assertions(1);
      const nonce = "12345678";
      redis.get.calledWith(`nonce:${nonce}`).mockResolvedValue(null);
      const valid = await validateNonce(redis, nonce);
      expect(valid).toBe(false);
    });
  });
});
