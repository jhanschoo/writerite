/* eslint-disable @typescript-eslint/no-unsafe-call */
import { YogaInitialContext } from 'graphql-yoga';
import Redis from 'ioredis';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

import { getClaims } from '../../../src/service/session';
import {
  CurrentUser,
  currentUserToUserJWT,
} from '../../../src/service/userJWT';

describe('currentUserToUserJWT and getClaims', () => {
  let redis: DeepMockProxy<Redis>;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    redis = mockDeep<Redis>();
  });

  afterEach(() => {
    mockReset(redis);
  });

  // Note: this is an integration test involving `getClaims` and the `userJWT` service
  test('currentUserToUserJWT generates a JWT compatible with getClaims', async () => {
    expect.assertions(1);
    const sub: CurrentUser = {
      bareId: 'foo',
      name: 'bar',
      roles: [],
      occupyingRoomSlugs: {},
    };
    const jwt = `Bearer ${await currentUserToUserJWT(sub)}`;
    redis.mget.mockResolvedValue(Promise.resolve([null]));
    await expect(
      getClaims(
        {
          request: {
            headers: {
              get: (headerKey: string) =>
                headerKey === 'Authorization' ? jwt : undefined,
            },
          },
        } as unknown as YogaInitialContext,
        redis
      )
    ).resolves.toEqual(sub);
  });
});
