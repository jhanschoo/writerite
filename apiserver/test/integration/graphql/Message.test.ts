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
import { testContextFactory, unsafeJwtToCurrentUser } from '../../helpers';
import { PubSub, YogaInitialContext } from 'graphql-yoga';
import { Context } from '../../../src/context';
import { WrServer, createGraphQLApp } from '../../../src/graphqlApp';
import {
  mutationRoomCreate,
} from '../../helpers/graphql/Room.util';
import {
  mutationMessageCreate,
  subscriptionMessageUpdatesByRoomSlug,
} from '../../helpers/graphql/Message.util';
import { MessageContentType, RoomState } from '../../../generated/typescript-operations';
import { CurrentUser } from '../../../src/service/userJWT';
import { PubSubPublishArgs } from '../../../src/types/PubSubPublishArgs';

describe('graphql/Message.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let pubsub: PubSub<PubSubPublishArgs>;
  let app: WrServer;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma, pubsub }] = testContextFactory();
    app = createGraphQLApp({ context, logging: false });
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
        const createUserResponse = await mutationCreateUser(app, { name: 'user1' });
        const token = createUserResponse.data.finalizeOauthSignin as string;
        setSub(unsafeJwtToCurrentUser(token));

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
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
        const refreshResponse = await mutationRefresh(app, token);
        const updatedToken = refreshResponse.data.refresh as string;
        const currentUser = unsafeJwtToCurrentUser(updatedToken);
        expect(Object.keys(currentUser.occupyingActiveRoomSlugs)).toHaveLength(1);
        setSub(currentUser);

        // create message
        const messageCreateResponse = await mutationMessageCreate(
          app,
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
        const { token } = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
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
        const { currentUser } = await refreshLogin(app, setSub, token);
        expect(Object.keys(currentUser.occupyingActiveRoomSlugs)).toHaveLength(1);

        // create subscription on room
        const roomUpdates = await subscriptionMessageUpdatesByRoomSlug(app, roomBefore.slug);
        expect(roomUpdates.body).toBeTruthy();
        if (!roomUpdates.body) {
          return;
        }

        // create message
        const messageCreateResponse = await mutationMessageCreate(
          app,
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
        const iterator = roomUpdates.body[Symbol.asyncIterator]();
        const readResultOne = await iterator.next();
        if (!readResultOne.done) {
          const event = JSON.parse(readResultOne.value.toString().slice(6));
          expect(event).toHaveProperty(
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
