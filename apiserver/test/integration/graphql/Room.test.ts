/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';

import { cascadingDelete } from '../_helpers/truncate';
import { loginAsNewlyCreatedUser, refreshLogin } from '../../helpers/graphql/User.util';
import { mutationDeckCreateEmpty, testContextFactory, trimSubscriptionHeartbeats } from '../../helpers';
import { PubSub, YogaInitialContext } from 'graphql-yoga';
import { Context } from '../../../src/context';
import { WrServer, createGraphQLApp } from '../../../src/graphqlApp';
import {
  mutationRoomJoin,
  mutationRoomCreate,
  mutationRoomSetDeck,
  mutationRoomSetState,
  queryOccupyingActiveRooms,
  queryRoom,
  subscriptionRoomUpdatesByRoomSlug,
} from '../../helpers/graphql/Room.util';
import { RoomState } from '../../../generated/typescript-operations';
import { nanoid } from 'nanoid';
import { CurrentUser } from '../../../src/service/userJWT';
import { PubSubPublishArgs } from '../../../src/types/PubSubPublishArgs';
import { mutationUserBefriendUser } from '../../helpers/graphql/Friendship.util';
import { mutationRoomInvitationSendSubdeck } from '../../helpers/graphql/RoomInvitation.util';

describe('graphql/Room.ts', () => {
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
    describe('roomJoin', () => {
      it('should allow a user with an invitation to join to an owned empty room in WAITING state', async () => {
        expect.assertions(2);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(app, setSub, 'user2');

        // create owner user
        const { currentUser: ownerUser } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: ownerUser.id,
            occupants: expect.arrayContaining([{ id: ownerUser.id }]),
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(app, { befriendedId: occupantBefore.id });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(app, { befriendedId: ownerUser.id });

        // owner sends invitation to occupant
        setSub(ownerUser);
        await mutationRoomInvitationSendSubdeck(app, {
          receiverId: occupantBefore.id,
          roomId: roomBefore.id,
        });

        // add occupant to room
        setSub(occupantBefore);
        const roomJoinResponse = await mutationRoomJoin(app, {
          id: roomBefore.id,
        });
        expect(roomJoinResponse).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            ownerId: ownerUser.id,
            occupants: expect.arrayContaining([{ id: ownerUser.id }, { id: occupantBefore.id }]),
          })
        );
      });

      it('should allow a user with an invitation to re-join a room in WAITING state with no apparent change in state', async () => {
        expect.assertions(2);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(app, setSub, 'user2');

        // create owner user
        const { currentUser: ownerUser } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        const room = roomCreateResponse.data.roomCreate;

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(app, { befriendedId: occupantBefore.id });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(app, { befriendedId: ownerUser.id });

        // owner sends invitation to occupant
        setSub(ownerUser);
        await mutationRoomInvitationSendSubdeck(app, {
          receiverId: occupantBefore.id,
          roomId: room.id,
        });

        // add occupant to room
        setSub(occupantBefore);
        const roomJoinResponse1 = await mutationRoomJoin(app, {
          id: room.id,
        });
        expect(roomJoinResponse1).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: ownerUser.id,
            occupants: expect.arrayContaining([{ id: ownerUser.id }, { id: occupantBefore.id }]),
          })
        );
        const roomBefore = roomJoinResponse1.data.roomJoin;

        // re-add occupant to room
        const roomJoinResponse2 = await mutationRoomJoin(app, {
          id: roomBefore.id,
        });
        expect(roomJoinResponse2).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            ownerId: ownerUser.id,
            occupants: expect.arrayContaining([{ id: ownerUser.id }, { id: occupantBefore.id }]),
          })
        );
      });

      it('should not allow a user with an invitation to join a room not in WAITING state', async () => {
        expect.assertions(3);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(app, setSub, 'user2');

        // create owner user
        const { currentUser: ownerUser } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        const room = roomCreateResponse.data.roomCreate;

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(app, { befriendedId: occupantBefore.id });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(app, { befriendedId: ownerUser.id });

        // owner sends invitation to occupant
        setSub(ownerUser);
        await mutationRoomInvitationSendSubdeck(app, {
          receiverId: occupantBefore.id,
          roomId: room.id,
        });

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deck = deckCreateResponse.data.deckCreate;

        // set deck
        await mutationRoomSetDeck(app, { id: room.id, deckId: deck.id });

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, {
          id: room.id,
          state: RoomState.Serving,
        });
        expect(roomSetStateResponse).toHaveProperty(
          'data.roomSetState',
          expect.objectContaining({
            id: room.id,
            state: RoomState.Serving,
            ownerId: ownerUser.id,
            deckId: deck.id,
            deck: {
              id: deck.id,
            },
          })
        );
        const roomBefore = roomSetStateResponse.data.roomSetState;

        // add occupant
        setSub(occupantBefore);
        const roomJoinResponse = await mutationRoomJoin(app, {
          id: roomBefore.id,
        });
        expect(roomJoinResponse).toHaveProperty('data', null);
        expect(roomJoinResponse.errors).not.toHaveLength(0);
      });

      it('should not allow a user to join a missing room', async () => {
        expect.assertions(2);

        // create occupant user
        await loginAsNewlyCreatedUser(app, setSub);
        const response = await mutationRoomJoin(app, {
          id: nanoid(),
        });
        expect(response).toHaveProperty('data', null);
        expect(response.errors).not.toHaveLength(0);
      });

      it('should not allow a user without an invitation to join a room', async () => {
        expect.assertions(3);

        // create room owner user
        const { currentUser: user1 } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user1.id,
            occupants: expect.arrayContaining([{ id: user1.id }]),
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create occupant user
        await loginAsNewlyCreatedUser(app, setSub);
        await loginAsNewlyCreatedUser(app, setSub, 'occupantBefore');

        const roomJoinResponse = await mutationRoomJoin(app, {
          id: roomBefore.id,
        });
        expect(roomJoinResponse).toHaveProperty('data', null);
        expect(roomJoinResponse.errors).not.toHaveLength(0);
      });
    });

    describe.skip('roomCleanUpDead', () => {
      // TODO: implement
    });

    describe('roomCreate', () => {
      it('should be able to create an empty room in WAITING state', async () => {
        expect.assertions(1);
        const { currentUser: user } = await loginAsNewlyCreatedUser(app, setSub);
        const response = await mutationRoomCreate(app);
        expect(response).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            slug: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user.id,
          })
        );
      });
    });

    describe('roomSetDeck', () => {
      it('should be able to set the deck of an owned room in WAITING state', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            deck: null,
            deckId: null,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );
      });

      it('should be able to re-set the same deck of an owned room in WAITING state with no apparent change in state', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        const room = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(app, {
          id: room.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponseBefore).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );
        const roomBefore = roomSetDeckResponseBefore.data.roomSetDeck;

        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );
      });

      it('should be able to change the deck of a room in WAITING state', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        const room = roomCreateResponse.data.roomCreate;

        // create first deck
        const deckCreateResponse1 = await mutationDeckCreateEmpty(app);
        const deck1 = deckCreateResponse1.data.deckCreate;

        // create second deck
        const deckCreateResponse2 = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse2.data.deckCreate;

        // set first deck
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(app, {
          id: room.id,
          deckId: deck1.id,
        });
        expect(roomSetDeckResponseBefore).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room.id,
            state: RoomState.Waiting,
            deckId: deck1.id,
            deck: {
              id: deck1.id,
            },
          })
        );
        const roomBefore = roomSetDeckResponseBefore.data.roomSetDeck;

        // set second deck
        const roomSetDeckResponse2 = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse2).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );
      });

      it('should fail to add a missing deck to a room in WAITING state', async () => {
        expect.assertions(3);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            deck: null,
            deckId: null,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: nanoid(),
        });
        expect(roomSetDeckResponse).toHaveProperty('data', null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });

      it.skip('should fail to add a deck to a room not in WAITING state', async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });

      it('should fail to add an deck to a missing room', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: nanoid(),
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty('data', null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });

      it('should fail to add a deck to an owned room if not authenticated as the owner of the room', async () => {
        expect.assertions(3);

        // create room owner user
        const { currentUser: user1 } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user1.id,
            deck: null,
            deckId: null,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create other user
        await loginAsNewlyCreatedUser(app, setSub, 'user2');

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty('data', null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });
    });

    describe('roomSetState', () => {
      it('should transition the state of an owned room in WAITING state to SERVING state with the deck set', async () => {
        expect.assertions(3);
        // create user
        const { currentUser: user } = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user.id,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, {
          id: roomBefore.id,
          state: RoomState.Serving,
        });
        expect(roomSetStateResponse).toHaveProperty(
          'data.roomSetState',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Serving,
            ownerId: user.id,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );
      });

      it('should fail to transition the state of an owned room in WAITING state to SERVING state without any deck set', async () => {
        expect.assertions(3);
        // create user
        const { currentUser: user } = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user.id,
            deckId: null,
            deck: null,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, {
          id: roomBefore.id,
          state: RoomState.Serving,
        });
        expect(roomSetStateResponse).toHaveProperty('data', null);
        expect(roomSetStateResponse.errors).not.toHaveLength(0);
      });

      it("should fail to transition the state of an another user's room in WAITING state to SERVING state", async () => {
        expect.assertions(4);
        // create user
        const { currentUser: user1 } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user1.id,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );

        // create user
        await loginAsNewlyCreatedUser(app, setSub, 'user2');

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, {
          id: roomBefore.id,
          state: RoomState.Serving,
        });
        expect(roomSetStateResponse).toHaveProperty('data', null);
        expect(roomSetStateResponse.errors).not.toHaveLength(0);
      });
    });
  });

  describe('Query', () => {
    describe('room', () => {
      it('should be able to return details of a room', async () => {
        expect.assertions(2);

        // create user
        const { currentUser: user } = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user.id,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // query room
        const roomQueryResponse = await queryRoom(app, roomBefore.id);
        expect(roomQueryResponse).toHaveProperty(
          'data.room',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            ownerId: user.id,
          })
        );
      });
    });

    describe.skip('occupyingActiveRooms', () => {
      it('should be able to return ids of owned rooms and rooms you are occupying state', async () => {
        expect.assertions(5);
        // create owner user
        const { currentUser: user1 } = await loginAsNewlyCreatedUser(app, setSub, 'user1');

        // create room
        const roomCreateResponse1 = await mutationRoomCreate(app);
        const room1 = roomCreateResponse1.data.roomCreate;

        // create room
        const roomCreateResponse2 = await mutationRoomCreate(app);
        const room2 = roomCreateResponse2.data.roomCreate;

        // create owner and occupant user
        const { currentUser: user2 } = await loginAsNewlyCreatedUser(app, setSub, 'user2');

        expect(user2.id).not.toEqual(user1.id);

        // user2 befriends user1
        await mutationUserBefriendUser(app, { befriendedId: user1.id });
        // user1 befriends user2
        setSub(user1);
        await mutationUserBefriendUser(app, { befriendedId: user2.id });

        // user1 sends invitation to user2 to room1
        await mutationRoomInvitationSendSubdeck(app, {
          receiverId: user2.id,
          roomId: room1.id,
        });

        // user1 sends invitation to user2 to room2
        await mutationRoomInvitationSendSubdeck(app, {
          receiverId: user2.id,
          roomId: room2.id,
        });

        // create room
        setSub(user2);
        const roomCreateResponse3 = await mutationRoomCreate(app);
        expect(roomCreateResponse3).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user2.id,
          })
        );
        const roomBefore3 = roomCreateResponse1.data.roomCreate;

        // user2 joins room1
        const roomJoinResponse1 = await mutationRoomJoin(app, {
          id: room1.id,
        });
        expect(roomJoinResponse1).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: room1.id,
            state: RoomState.Waiting,
            ownerId: user1.id,
          })
        );
        const roomBefore1 = roomJoinResponse1.data.roomJoin;
        // user2 joins room2
        const roomJoinResponse2 = await mutationRoomJoin(app, {
          id: room2.id,
        });
        expect(roomJoinResponse2).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: room2.id,
            state: RoomState.Waiting,
            ownerId: user1.id,
          })
        );
        const roomBefore2 = roomJoinResponse2.data.roomJoin;

        // query room
        const occupyingActiveRoomsResponse = await queryOccupyingActiveRooms(app);
        expect(occupyingActiveRoomsResponse).toHaveProperty(
          'data.occupyingActiveRooms',
          expect.arrayContaining([
            expect.objectContaining({ id: roomBefore1.id }),
            expect.objectContaining({ id: roomBefore2.id }),
            expect.objectContaining({ id: roomBefore3.idf}),
          ])
        );
      });
    });
  });

  describe('Subscription', () => {
    describe('roomUpdatesByRoomSlug', () => {
      it('should yield an appropriate integration event when the room it is subscribed to has roomSetDeck run on it', async () => {
        expect.assertions(5);

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

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // we have to update our claims before we can establish a subscription
        const { currentUser } = await refreshLogin(app, setSub, token);
        expect(Object.keys(currentUser.occupyingActiveRoomSlugs)).toHaveLength(1);

        // create subscription
        const roomUpdates = await subscriptionRoomUpdatesByRoomSlug(app, roomBefore.slug);
        expect(roomUpdates.body).toBeTruthy();
        if (!roomUpdates.body) {
          return;
        }

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );

        // assert subscription result
        const readResult = await trimSubscriptionHeartbeats(roomUpdates.body).next();
        if (!readResult.done) {
          const event = JSON.parse(readResult.value);
          expect(event).toHaveProperty(
            'data.roomUpdatesByRoomSlug',
            expect.objectContaining({
              operation: 'roomSetDeck',
              value: {
                id: roomBefore.id,
                deckId: deckBefore.id,
                deck: {
                  id: deckBefore.id,
                },
                state: RoomState.Waiting,
                userIdOfLastAddedOccupantForSubscription: null,
                userOfLastAddedOccupantForSubscription: null,
              },
            })
          );
        }
      });

      it('should yield an appropriate integration event when the room it is subscribed to has roomJoin run on it', async () => {
        expect.assertions(5);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(app, setSub, 'user2');

        // create owner user
        const { token, currentUser: ownerUser } = await loginAsNewlyCreatedUser(
          app,
          setSub,
          'user1'
        );

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: ownerUser.id,
            occupants: expect.arrayContaining([{ id: ownerUser.id }]),
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // we have to update our claims before we can establish a subscription
        const { currentUser } = await refreshLogin(app, setSub, token);
        expect(Object.keys(currentUser.occupyingActiveRoomSlugs)).toHaveLength(1);

        // create subscription
        const roomUpdates = await subscriptionRoomUpdatesByRoomSlug(app, roomBefore.slug);
        expect(roomUpdates.body).toBeTruthy();
        if (!roomUpdates.body) {
          return;
        }

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(app, { befriendedId: occupantBefore.id });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(app, { befriendedId: ownerUser.id });

        // owner sends invitation to occupant
        setSub(ownerUser);
        await mutationRoomInvitationSendSubdeck(app, {
          receiverId: occupantBefore.id,
          roomId: roomBefore.id,
        });

        // add occupant to room
        setSub(occupantBefore);
        const roomJoinResponse = await mutationRoomJoin(app, {
          id: roomBefore.id,
          // occupantId: occupantBefore.id,
        });
        expect(roomJoinResponse).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            ownerId: ownerUser.id,
            occupants: expect.arrayContaining([{ id: ownerUser.id }, { id: occupantBefore.id }]),
          })
        );

        // assert subscription result
        const readResult = await trimSubscriptionHeartbeats(roomUpdates.body).next();
        if (!readResult.done) {
          const event = JSON.parse(readResult.value);
          expect(event).toHaveProperty(
            'data.roomUpdatesByRoomSlug',
            expect.objectContaining({
              operation: 'roomJoin',
              value: {
                id: roomBefore.id,
                deckId: null,
                deck: null,
                state: RoomState.Waiting,
                userIdOfLastAddedOccupantForSubscription: occupantBefore.id,
                userOfLastAddedOccupantForSubscription: {
                  id: occupantBefore.id,
                },
              },
            })
          );
        }
      });

      it('should yield an appropriate integration event when the room it is subscribed to changes state by roomSetState', async () => {
        expect.assertions(7);
        // create user
        const { currentUser: user, token } = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            state: RoomState.Waiting,
            ownerId: user.id,
          })
        );
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // we have to update our claims before we can establish a subscription
        const { currentUser } = await refreshLogin(app, setSub, token);
        expect(Object.keys(currentUser.occupyingActiveRoomSlugs)).toHaveLength(1);

        // create subscription
        const roomUpdates = await subscriptionRoomUpdatesByRoomSlug(app, roomBefore.slug);
        expect(roomUpdates.body).toBeTruthy();
        if (!roomUpdates.body) {
          return;
        }

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, {
          id: roomBefore.id,
          deckId: deckBefore.id,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Waiting,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );

        // assert subscription result for deck
        const iterator = trimSubscriptionHeartbeats(roomUpdates.body);
        const readResultOne = await iterator.next();
        if (!readResultOne.done) {
          const event = JSON.parse(readResultOne.value);
          expect(event).toHaveProperty(
            'data.roomUpdatesByRoomSlug',
            expect.objectContaining({
              operation: 'roomSetDeck',
              value: {
                id: roomBefore.id,
                deckId: deckBefore.id,
                deck: {
                  id: deckBefore.id,
                },
                state: RoomState.Waiting,
                userIdOfLastAddedOccupantForSubscription: null,
                userOfLastAddedOccupantForSubscription: null,
              },
            })
          );
        }

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, {
          id: roomBefore.id,
          state: RoomState.Serving,
        });
        expect(roomSetStateResponse).toHaveProperty(
          'data.roomSetState',
          expect.objectContaining({
            id: roomBefore.id,
            state: RoomState.Serving,
            ownerId: user.id,
            deckId: deckBefore.id,
            deck: {
              id: deckBefore.id,
            },
          })
        );

        // assert subscription result
        const readResultTwo = await iterator.next();
        if (!readResultTwo.done) {
          const event = JSON.parse(readResultTwo.value);
          expect(event).toHaveProperty(
            'data.roomUpdatesByRoomSlug',
            expect.objectContaining({
              operation: 'roomSetState',
              value: {
                id: roomBefore.id,
                deckId: deckBefore.id,
                deck: {
                  id: deckBefore.id,
                },
                state: RoomState.Serving,
                userIdOfLastAddedOccupantForSubscription: null,
                userOfLastAddedOccupantForSubscription: null,
              },
            })
          );
        }
      });
    });
  });
});
