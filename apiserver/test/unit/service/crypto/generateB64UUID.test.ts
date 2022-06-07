import { generateB64UUID } from "../../../../src/service/crypto/generateB64UUID";

describe("service/crypto/generateB64UUID", () => {
	test("generateB64UUID generates distinct strings", () => {
		expect.assertions(31 * 32 / 2);
		const a: string[] = [];
		for (let i = 0; i < 32; ++i) {
			a[i] = generateB64UUID();
			for (let j = 0; j < i; ++j) {
				expect(a[i]).not.toBe(a[j]);
			}
		}
	});
});
