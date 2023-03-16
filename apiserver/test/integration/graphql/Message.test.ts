/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';

import { cascadingDelete } from '../_helpers/truncate';
import {
  loginAsNewlyCreatedUser,
  mutationCreateUser,
  mutationRefresh,
  refreshLogin,
} from '../../helpers/graphql/User.util';
import { testContextFactory } from '../../helpers';
import { YogaInitialContext } from 'graphql-yoga';
import { Context } from '../../../src/context';
import { createGraphQLApp } from '../../../src/graphqlApp';
import { mutationRoomCreate } from '../../helpers/graphql/Room.util';
import {
  mutationMessageCreate,
  subscriptionMessageUpdatesByRoomSlug,
} from '../../helpers/graphql/Message.util';
import { MessageContentType, RoomState } from '../../../generated/typescript-operations';
import { CurrentUser } from '../../../src/service/userJWT';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';

describe('graphql/Message.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma }] = testContextFactory();
    const server = createGraphQLApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    await cascadingDelete(prisma).user;
  });

  describe('Mutation', () => {
    describe('messageCreate', () => {
      it('should allow the owner-occupant of the rome to create a message for the room', async () => {
        expect.assertions(3);
        // create user
        const createUserResponse = await mutationCreateUser(executor, { name: 'user1' });
        const currentUser1 = createUserResponse.data.finalizeOauthSignin.currentUser as CurrentUser;
        const token = createUserResponse.data.finalizeOauthSignin.token as string;
        setSub(currentUser1);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            slug: expect.any(String),
            state: RoomState.Waiting,
            deck: null,
            deckId: null,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // we have to update our claims before we can create/send messages
        const refreshResponse = await mutationRefresh(executor, token);
        const currentUser2 = refreshResponse.data.refresh.currentUser as CurrentUser;
        expect(Object.keys(currentUser2.occupyingActiveRoomSlugs)).toHaveLength(1);
        setSub(currentUser2);

        // create message
        const messageCreateResponse = await mutationMessageCreate(
          executor,
          { text: 'Hello World' },
          roomBefore.slug as string,
          MessageContentType.Text
        );
        expect(messageCreateResponse).toHaveProperty(
          'data.messageCreate',
          expect.objectContaining({
            content: { text: 'Hello World' },
            createdAt: expect.any(String),
            id: expect.any(String),
            roomId: roomBefore.id,
            senderId: currentUser2.id,
            type: MessageContentType.Text,
          })
        );
      });
    });
  });

  describe('Query', () => {
    // TODO: implement
  });

  describe.skip('Subscription', () => {
    describe('messageUpdatesByRoomSlug', () => {
      it('should yield an appropriate integration event when the room it is subscribed to has messageCreate run on it', async () => {
        expect.assertions(6);
        // create user
        const { token } = await loginAsNewlyCreatedUser(executor, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            slug: expect.any(String),
            state: RoomState.Waiting,
            deck: null,
            deckId: null,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // we have to update our claims before we can create/send messages or establish a subscription
        const { currentUser } = await refreshLogin(executor, setSub, token);
        expect(Object.keys(currentUser.occupyingActiveRoomSlugs)).toHaveLength(1);

        // create subscription on room
        const roomUpdates = await subscriptionMessageUpdatesByRoomSlug(executor, roomBefore.slug);
        const roomUpdatesIterator = roomUpdates[Symbol.asyncIterator]();

        // create message
        const messageCreateResponse = await mutationMessageCreate(
          executor,
          { text: 'Hello World' },
          roomBefore.slug as string,
          MessageContentType.Text
        );
        expect(messageCreateResponse).toHaveProperty(
          'data.messageCreate',
          expect.objectContaining({
            content: { text: 'Hello World' },
            createdAt: expect.any(String),
            id: expect.any(String),
            roomId: roomBefore.id,
            senderId: currentUser.id,
            type: MessageContentType.Text,
          })
        );

        // assert subscription result for message creation
        const readResultOne = await roomUpdatesIterator.next();
        if (!readResultOne.done) {
          expect(readResultOne.value).toHaveProperty(
            'data.messageUpdatesByRoomSlug',
            expect.objectContaining({
              operation: 'messageCreate',
              value: {
                content: { text: 'Hello World' },
                createdAt: expect.any(String),
                id: expect.any(String),
                roomId: roomBefore.id,
                senderId: currentUser.id,
                type: MessageContentType.Text,
              },
            })
          );
        }
      });
    });
  });
});
