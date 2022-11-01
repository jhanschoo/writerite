/* eslint-disable @typescript-eslint/no-floating-promises */
import { YogaInitialContext } from 'graphql-yoga';
import Redis from 'ioredis';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { getClaims } from '../../../../src/service/session';

describe('getClaims', () => {
  let redis: DeepMockProxy<Redis>;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    redis = mockDeep<Redis>();
  });

  afterEach(() => {
    mockReset(redis);
  });

  test('getClaims returns undefined on bad context', () => {
    expect.assertions(1);
    redis.mget.mockResolvedValue(Promise.resolve([null]));
    expect(getClaims({} as YogaInitialContext, redis)).resolves.toBeUndefined();
  });

  test('getClaims returns undefined on missing jwt', () => {
    expect.assertions(1);
    redis.mget.mockResolvedValue(Promise.resolve([null]));
    const variables = { hello: 'world' };
    const ctx = { headers: { variables } } as unknown as YogaInitialContext;
    expect(getClaims(ctx, redis)).resolves.toBeUndefined();
  });

  test('getClaims returns undefined if header not present', () => {
    expect.assertions(1);
    redis.mget.mockResolvedValue(Promise.resolve([null]));
    const ctx = { request: { headers: { get: () => undefined } } } as unknown as YogaInitialContext;
    expect(getClaims(ctx, redis)).resolves.toBeUndefined();
  });

  test('getClaims returns undefined if Authorization header is malformed', () => {
    expect.assertions(1);
    redis.mget.mockResolvedValue(Promise.resolve([null]));
    const ctx = { request: { headers: { get: () => 'abc' } } } as unknown as YogaInitialContext;
    expect(getClaims(ctx, redis)).resolves.toBeUndefined();
  });
});
