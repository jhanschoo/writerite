/* eslint-disable @typescript-eslint/no-floating-promises */
import { errors } from 'jose';

import {
  CurrentUser,
  currentUserToUserJWT,
  verifyStaleUserJWT,
  verifyUserJWT,
} from '../../../src/service/userJWT';

describe('userJWT', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('verifyUserJWT', () => {
    it('should successfully verify a valid JWT', async () => {
      expect.assertions(1);
      const currentUser = { hello: 'world' } as unknown as CurrentUser;
      const jwt = await currentUserToUserJWT(currentUser, 60);
      const { sub } = await verifyUserJWT(jwt);
      expect(sub).toEqual(currentUser);
    });

    it('should fail to verify an expired JWT', async () => {
      expect.assertions(1);
      jest.setSystemTime(new Date('2000-01-01T01:00:00'));
      const currentUser = { hello: 'world' } as unknown as CurrentUser;
      const jwt = await currentUserToUserJWT(currentUser, 10);
      jest.setSystemTime(new Date('2000-01-01T01:01:00'));
      await expect(verifyUserJWT(jwt)).rejects.toBeInstanceOf(
        errors.JWTExpired
      );
    });
  });

  describe('verifyStaleUserJWT', () => {
    it('should successfully verify a JWT that has expired within the week', async () => {
      expect.assertions(1);
      jest.setSystemTime(new Date('2000-01-01T01:00:00'));
      const currentUser = { hello: 'world' } as unknown as CurrentUser;
      const jwt = await currentUserToUserJWT(currentUser, 10);
      jest.setSystemTime(new Date('2000-01-01T04:00:00'));
      const { sub } = await verifyStaleUserJWT(jwt);
      expect(sub).toEqual(currentUser);
    });
    it('should fail to verify a JWT that has expired 40 days ago', async () => {
      expect.assertions(1);
      jest.setSystemTime(new Date('2000-01-01T01:00:00'));
      const currentUser = { hello: 'world' } as unknown as CurrentUser;
      const jwt = await currentUserToUserJWT(currentUser, 10);
      jest.setSystemTime(new Date('2000-02-01T01:01:00'));
      await expect(verifyStaleUserJWT(jwt)).rejects.toBeInstanceOf(
        errors.JWTExpired
      );
    });
  });
});
