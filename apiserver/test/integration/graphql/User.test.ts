/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from '@prisma/client';
import { YogaInitialContext } from 'graphql-yoga';

import { cascadingDelete } from '../_helpers/truncate';
import {
  DEFAULT_CREATE_USER_VALUES,
  createUser,
  mutationUserEdit,
  queryAllUserAccessibleUserScalars,
  queryUserPublicScalars,
  testContextFactory,
  unsafeJwtToCurrentUser,
} from '../../helpers';
import { Context } from '../../../src/context';
import { WrServer, createGraphQLApp } from '../../../src/graphqlApp';
import { CurrentUser, Roles } from '../../../src/service/userJWT';

describe('graphql/User.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let server: WrServer;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma }] = testContextFactory();
    server = createGraphQLApp({ context, logging: false });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    setSub(undefined);
    await cascadingDelete(prisma).user;
  });

  describe('Mutation', () => {
    describe('finalizeOauthSignin', () => {
      it('should be able to create a user with development authentication in test environment', async () => {
        expect.assertions(2);

        const name = 'user1';
        // create user
        const response = await createUser(server, { name });
        expect(response).toHaveProperty('data.finalizeOauthSignin', expect.any(String));
        const currentUser = unsafeJwtToCurrentUser(response.data.finalizeOauthSignin as string);
        expect(currentUser).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          occupyingActiveRoomSlugs: [],
          roles: [Roles.User],
        });
      });
    });
    describe('userEdit', () => {
      // TODO: implement
    });
  });

  describe('Query', () => {
    describe('user', () => {
      it('should be able to fetch all user-accessible fields of current user', async () => {
        expect.assertions(1);

        // create user
        const createUserResponse = await createUser(server);
        const currentUserBefore = unsafeJwtToCurrentUser(
          createUserResponse.data.finalizeOauthSignin as string
        );

        // login as user
        setSub(currentUserBefore);

        // query own user
        const queryUserRequest = await queryAllUserAccessibleUserScalars(
          server,
          currentUserBefore.id
        );
        expect(queryUserRequest).toHaveProperty('data.user', {
          id: currentUserBefore.id,
          name: DEFAULT_CREATE_USER_VALUES.name,
          isPublic: false,
          roles: [Roles.User],
        });
      });

      it('should not be able to fetch all user-accessible fields of private user if not logged in', async () => {
        expect.assertions(2);

        // create user
        const createUserResponse = await createUser(server);
        const { id } = unsafeJwtToCurrentUser(
          createUserResponse.data.finalizeOauthSignin as string
        );

        // query user
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, id);
        expect(queryUserResponse.data).toBeNull();
        expect(queryUserResponse.errors).not.toHaveLength(0);
      });

      it('should not be able to fetch all user-accessible fields of private user if logged in as another user', async () => {
        expect.assertions(2);

        // create other user
        const createUserResponse1 = await createUser(server, { name: 'user1' });
        const { id } = unsafeJwtToCurrentUser(
          createUserResponse1.data.finalizeOauthSignin as string
        );

        // create user
        const createUserResponse2 = await createUser(server, { name: 'user2' });
        const currentUser = unsafeJwtToCurrentUser(
          createUserResponse2.data.finalizeOauthSignin as string
        );
        // log in as user
        setSub(currentUser);

        // query other user
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, id);
        expect(queryUserResponse.data).toBeNull();
        expect(queryUserResponse.errors).not.toHaveLength(0);
      });
      it('should be able to fetch public fields of private user if not logged in', async () => {
        expect.assertions(1);

        // create user
        const createUserResponse = await createUser(server);
        const { id } = unsafeJwtToCurrentUser(
          createUserResponse.data.finalizeOauthSignin as string
        );

        // query user
        const queryUserResponse = await queryUserPublicScalars(server, id);
        expect(queryUserResponse).toHaveProperty('data.user', {
          id,
          isPublic: false,
        });
      });
      it('should be able to fetch public fields of private user if logged in as another user', async () => {
        expect.assertions(1);

        // create other user
        const createUserResponse1 = await createUser(server, { name: 'user1' });
        const { id } = unsafeJwtToCurrentUser(
          createUserResponse1.data.finalizeOauthSignin as string
        );

        // create user
        const createUserResponse2 = await createUser(server, { name: 'user2' });
        const currentUser = unsafeJwtToCurrentUser(
          createUserResponse2.data.finalizeOauthSignin as string
        );

        // log in as user
        setSub(currentUser);

        // query other user
        const queryUserResponse = await queryUserPublicScalars(server, id);
        expect(queryUserResponse).toHaveProperty('data.user', {
          id,
          isPublic: false,
        });
      });
      it('should be able to fetch all fields of public user if not logged in', async () => {
        expect.assertions(1);

        // create user
        const createUserResponse = await createUser(server);
        const currentUser = unsafeJwtToCurrentUser(
          createUserResponse.data.finalizeOauthSignin as string
        );

        // log in as user
        setSub(currentUser);
        // make user public
        await mutationUserEdit(server, { isPublic: true });
        // log out
        setSub(undefined);

        // query user
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, currentUser.id);
        expect(queryUserResponse).toHaveProperty('data.user', {
          id: currentUser.id,
          name: DEFAULT_CREATE_USER_VALUES.name,
          isPublic: true,
          roles: [Roles.User],
        });
      });
      it('should be able to fetch all fields of public user if logged in as another user', async () => {
        expect.assertions(1);

        // create target user
        const createUserResponse1 = await createUser(server, { name: 'user1' });
        const targetUser = unsafeJwtToCurrentUser(
          createUserResponse1.data.finalizeOauthSignin as string
        );

        // log in as target user
        setSub(targetUser);

        // make target user public
        await mutationUserEdit(server, { isPublic: true });

        // create user
        const createUserResponse2 = await createUser(server, { name: 'user2' });
        const currentUser = unsafeJwtToCurrentUser(
          createUserResponse2.data.finalizeOauthSignin as string
        );

        // log in as user
        setSub(currentUser);

        // query target user
        const queryUserResponse = await queryAllUserAccessibleUserScalars(server, targetUser.id);
        expect(queryUserResponse).toHaveProperty('data.user', {
          id: targetUser.id,
          name: 'user1',
          isPublic: true,
          roles: [Roles.User],
        });
      });
    });
  });
});
