import { generateJWT, getClaims, comparePassword, hashPassword, generateB64UUID } from '../src/util';

describe('getClaims', () => {
  test('getClaims returns null on bad context', () => {
    expect.assertions(1);
    expect(getClaims({})).toBeNull();
  });

  test(`getClaims copies sub if present in context without checking,
    relying on JWT signature to vouch that it is well-formed`, () => {
      expect.assertions(1);
      const sub = { hello: 'world' };
      expect(getClaims({ sub })).toEqual({ sub });
    });

  test('getClaims returns sub if sub has ICurrentUser shape', () => {
    expect.assertions(1);
    const sub = { id: 'a', email: 'b', roles: [] };
    expect(getClaims({ sub })).toHaveProperty('sub', sub);
  });

  test('getClaims returns null if header not present', () => {
    expect.assertions(1);
    const ctx = { request: { get: () => undefined } };
    expect(getClaims(ctx)).toBeNull();
  });

  test('getClaims returns null if Authorization header is malformed', () => {
    expect.assertions(1);
    const ctx = { request: { get: () => 'abc' } };
    expect(getClaims(ctx)).toBeNull();
  });
});

describe('JWTs', () => {
  test('generateJWT generates a JWT compatible with getClaims', () => {
    expect.assertions(1);
    const sub = { hello: 'world' };
    const jwt = `Bearer ${generateJWT(sub)}`;
    expect(getClaims({
      request: {
        get: (headerKey: string) => {
          if (headerKey === 'Authorization') {
            return jwt;
          }
        },
      },
    })).toHaveProperty('sub', sub);
  });
});

describe('passwords', () => {
  test('comparePassword fails on malformed', async () => {
    expect.assertions(1);
    const passwordResultP = await comparePassword('123', 'abc');
    expect(passwordResultP).toBe(false);
  });

  test('hashPassword generates a hash compatible with comparePassword', async () => {
    expect.assertions(1);
    const hash = await hashPassword('12345');
    const passwordResultP = await comparePassword('12345', hash);
    expect(passwordResultP).toBe(true);
  });
});

describe('generateB64UUID', () => {
  test('generateB64UUID generates distinct strings', () => {
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
