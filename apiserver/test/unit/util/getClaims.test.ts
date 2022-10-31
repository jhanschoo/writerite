/* eslint-disable @typescript-eslint/no-unsafe-call */
import { YogaInitialContext } from 'graphql-yoga';
import { CurrentUser, currentUserToUserJWT } from '../../../src/service/userJWT';
import { getClaims } from '../../../src/util';

describe('util/getClaims', () => {
  // Note: this is an integration test involving `getClaims` and the `userJWT` service
  test('currentUserToUserJWT generates a JWT compatible with getClaims', async () => {
    expect.assertions(1);
    const sub = { hello: 'world' } as unknown as CurrentUser;
    const jwt = `Bearer ${await currentUserToUserJWT(sub)}`;
    await expect(
      getClaims({
        request: {
          headers: {
            get: (headerKey: string) => (headerKey === 'Authorization' ? jwt : undefined),
          },
        },
      } as unknown as YogaInitialContext)
    ).resolves.toEqual(sub);
  });
});
