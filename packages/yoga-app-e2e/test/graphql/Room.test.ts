/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { encodeGlobalID } from '@pothos/plugin-relay';
import { PrismaClient, Unit } from 'database';
import { YogaInitialContext } from 'graphql-yoga';
import { nanoid } from 'nanoid';
import { Context, CurrentUser, createYogaServerApp } from 'yoga-app';

import {
  RoomType,
  RoomUpdateOperations,
  RoundState,
} from '../generated/gql/graphql';
import { mutationDeckCreateEmpty, testContextFactory } from '../helpers';
import { mutationUserBefriendUser } from '../helpers/graphql/Friendship.util';
import {
  mutationRoomCreate,
  mutationRoomJoin,
  mutationRoomSetDeck,
  mutationRoomStartRound,
  queryOccupyingUnarchivedRooms,
  queryRoom,
  subscriptionRoomUpdatesByRoomId,
} from '../helpers/graphql/Room.util';
import {
  loginAsNewlyCreatedUser,
  refreshLogin,
} from '../helpers/graphql/User.util';
import { cascadingDelete } from '../helpers/truncate';

describe('graphql/Room.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma }] = testContextFactory();
    const server = createYogaServerApp({ context, logging: false });
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
    describe('roomJoin', () => {
      it('should allow a user to join to an room that a friend is occupying with no active round', async () => {
        expect.assertions(2);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user2'
        );
        const occupantGid = encodeGlobalID('User', occupantBefore.bareId);

        // create owner user
        const { currentUser: ownerUser } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user1'
        );
        const ownerGid = encodeGlobalID('User', ownerUser.bareId);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            activeRound: null,
            type: RoomType.Ephemeral,
            occupants: expect.arrayContaining([{ id: ownerGid }]),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(executor, {
          befriendedId: occupantGid,
        });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(executor, {
          befriendedId: ownerGid,
        });

        // occupant-to-be joins room
        setSub(occupantBefore);
        const roomJoinResponse = await mutationRoomJoin(executor, {
          id: roomBefore?.id as string,
        });
        expect(roomJoinResponse).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: roomBefore?.id,
            activeRound: null,
            type: RoomType.Ephemeral,
            occupants: expect.arrayContaining([
              { id: ownerGid },
              { id: occupantGid },
            ]),
          })
        );
      });

      it('should allow a user to join a room that a friend is occupying with an active round in WAITING state', async () => {
        expect.assertions(2);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user2'
        );
        const occupantGid = encodeGlobalID('User', occupantBefore.bareId);

        // create owner user
        const { currentUser: ownerUser } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user1'
        );
        const ownerGid = encodeGlobalID('User', ownerUser.bareId);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        const room = roomCreateResponse.data?.roomCreate;

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(executor, {
          befriendedId: occupantGid,
        });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(executor, {
          befriendedId: ownerGid,
        });

        // create deck
        setSub(ownerUser);
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deck = deckCreateResponse.data?.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: room?.id as string,
          deckId: deck?.id as string,
        });

        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room?.id,
            type: RoomType.Ephemeral,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            }),
            occupants: [expect.objectContaining({ id: ownerGid })],
          })
        );
        const roomBefore = roomSetDeckResponse.data?.roomSetDeck;

        // add occupant
        setSub(occupantBefore);
        const roomJoinResponse = await mutationRoomJoin(executor, {
          id: roomBefore?.id as string,
        });
        expect(roomJoinResponse).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: roomBefore?.id,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            }),
            type: RoomType.Ephemeral,
            occupants: expect.arrayContaining([
              { id: ownerGid },
              { id: occupantGid },
            ]),
          })
        );
      });

      it('should allow a user to join a room that a friend is occupying with an active round in PLAYING state', async () => {
        expect.assertions(2);

        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user2'
        );
        const occupantGid = encodeGlobalID('User', occupantBefore.bareId);

        // create owner user
        const { currentUser: ownerUser } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user1'
        );
        const ownerGid = encodeGlobalID('User', ownerUser.bareId);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        const room = roomCreateResponse.data?.roomCreate;

        // owner befriends occupant-to-be
        await mutationUserBefriendUser(executor, {
          befriendedId: occupantGid,
        });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(executor, {
          befriendedId: ownerGid,
        });

        // create deck
        setSub(ownerUser);
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deck = deckCreateResponse.data?.deckCreate;

        // set deck
        await mutationRoomSetDeck(executor, {
          id: room?.id as string,
          deckId: deck?.id as string,
        });

        // transition state
        const roomStartRoundResponse = await mutationRoomStartRound(executor, {
          id: room?.id as string,
        });
        expect(roomStartRoundResponse).toHaveProperty(
          'data.roomStartRound',
          expect.objectContaining({
            id: room?.id,
            type: RoomType.Ephemeral,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              isActive: true,
              state: RoundState.Playing,
            }),
            occupants: [expect.objectContaining({ id: ownerGid })],
          })
        );
        const roomBefore = roomStartRoundResponse.data?.roomStartRound;

        // add occupant
        setSub(occupantBefore);
        const roomJoinResponse = await mutationRoomJoin(executor, {
          id: roomBefore?.id as string,
        });
        expect(roomJoinResponse).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: roomBefore?.id,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              isActive: true,
              state: RoundState.Playing,
            }),
            type: RoomType.Ephemeral,
            occupants: expect.arrayContaining([
              { id: ownerGid },
              { id: occupantGid },
            ]),
          })
        );
      });

      it('should not allow a user to join a missing room', async () => {
        expect.assertions(2);

        // create occupant user
        await loginAsNewlyCreatedUser(executor, setSub);
        const response = await mutationRoomJoin(executor, {
          id: encodeGlobalID('Room', nanoid()),
        });
        expect(response).toHaveProperty('data', null);
        expect(response.errors).not.toHaveLength(0);
      });
    });

    describe('roomCreate', () => {
      it('should be able to create a room with no active round', async () => {
        expect.assertions(1);
        const { currentUser: user } = await loginAsNewlyCreatedUser(
          executor,
          setSub
        );
        const ownerGid = encodeGlobalID('User', user.bareId);
        const response = await mutationRoomCreate(executor);
        expect(response).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: [expect.objectContaining({ id: ownerGid })],
          })
        );
      });
    });

    describe('roomSetDeck', () => {
      it('should be able to set the deck of an owned room in WAITING state', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse.data?.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
              deck: {
                id: deckBefore?.id as string,
              },
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
      });

      it('should be able to re-set the same deck of an owned room in WAITING state with no apparent change in state', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        const room = roomCreateResponse.data?.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse.data?.deckCreate;

        // set deck
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(executor, {
          id: room?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponseBefore).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              deck: {
                id: deckBefore?.id as string,
              },
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
        const roomBefore = roomSetDeckResponseBefore.data?.roomSetDeck;

        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              deck: {
                id: deckBefore?.id as string,
              },
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
      });

      it('should be able to change the deck of a room in WAITING state', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        const room = roomCreateResponse.data?.roomCreate;

        // create first deck
        const deckCreateResponse1 = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deck1 = deckCreateResponse1.data?.deckCreate;

        // create second deck
        const deckCreateResponse2 = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse2.data?.deckCreate;

        // set first deck
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(executor, {
          id: room?.id as string,
          deckId: deck1?.id as string,
        });
        expect(roomSetDeckResponseBefore).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              deck: {
                id: deck1?.id as string,
              },
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
        const roomBefore = roomSetDeckResponseBefore.data?.roomSetDeck;

        // set second deck
        const roomSetDeckResponse2 = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse2).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              deck: {
                id: deckBefore?.id as string,
              },
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
      });

      it('should fail to add a missing deck to a room in WAITING state', async () => {
        expect.assertions(3);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: nanoid(),
        });
        expect(roomSetDeckResponse).toHaveProperty('data', null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });

      it('should fail to add a deck to a room with a PLAYING state round', async () => {
        expect.assertions(4);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        const room = roomCreateResponse.data?.roomCreate;

        // create first deck
        const deckCreateResponse1 = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deck1 = deckCreateResponse1.data?.deckCreate;

        // create second deck
        const deckCreateResponse2 = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse2.data?.deckCreate;

        // set first deck
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(executor, {
          id: room?.id as string,
          deckId: deck1?.id as string,
        });
        expect(roomSetDeckResponseBefore).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: room?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              deck: {
                id: deck1?.id as string,
              },
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
        const roomBefore = roomSetDeckResponseBefore.data?.roomSetDeck;

        // transition state
        const roomStartRoundResponse = await mutationRoomStartRound(executor, {
          id: room?.id as string,
        });
        expect(roomStartRoundResponse).toHaveProperty(
          'data.roomStartRound',
          expect.objectContaining({
            id: room?.id,
            type: RoomType.Ephemeral,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              isActive: true,
              deck: {
                id: deck1?.id as string,
              },
              slug: expect.any(String),
              state: RoundState.Playing,
            }),
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );

        // set second deck
        const roomSetDeckResponse2 = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse2).toHaveProperty('data', null);
        expect(roomSetDeckResponse2.errors).not.toHaveLength(0);
      });

      it('should fail to add an deck to a missing room', async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse.data?.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: nanoid(),
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse).toHaveProperty('data', null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });

      describe('roomStartRound', () => {
        it('should transition the state of the active round from WAITING to PLAYING state', async () => {
          expect.assertions(3);
          // create user
          const { currentUser: user } = await loginAsNewlyCreatedUser(
            executor,
            setSub
          );
          // create room
          const roomCreateResponse = await mutationRoomCreate(executor);
          expect(roomCreateResponse).toHaveProperty(
            'data.roomCreate',
            expect.objectContaining({
              id: expect.any(String),
              type: RoomType.Ephemeral,
              activeRound: null,
              occupants: expect.objectContaining({ length: 1 }),
            })
          );
          const roomBefore = roomCreateResponse.data?.roomCreate;
          // create deck
          const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
            input: {
              answerLang: 'en',
              cards: [],
              name: 'name',
              promptLang: 'en',
            },
          });
          const deckBefore = deckCreateResponse.data?.deckCreate;
          // set deck
          const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
            id: roomBefore?.id as string,
            deckId: deckBefore?.id as string,
          });
          expect(roomSetDeckResponse).toHaveProperty(
            'data.roomSetDeck',
            expect.objectContaining({
              id: roomBefore?.id as string,
              type: RoomType.Ephemeral,
              activeRound: {
                id: expect.any(String),
                deck: {
                  id: deckBefore?.id as string,
                },
                slug: expect.any(String),
                isActive: true,
                state: RoundState.Waiting,
              },
              occupants: [expect.objectContaining({ id: expect.any(String) })],
            })
          );
          // transition state
          const roomStartRoundResponse = await mutationRoomStartRound(
            executor,
            {
              id: roomBefore?.id as string,
            }
          );
          expect(roomStartRoundResponse).toHaveProperty(
            'data.roomStartRound',
            expect.objectContaining({
              id: roomBefore?.id as string,
              type: RoomType.Ephemeral,
              activeRound: {
                id: expect.any(String),
                deck: {
                  id: deckBefore?.id as string,
                },
                slug: expect.any(String),
                isActive: true,
                state: RoundState.Playing,
              },
              occupants: [expect.objectContaining({ id: expect.any(String) })],
            })
          );
        });

        it("should fail to transition the state of an another user's room in WAITING state to SERVING state", async () => {
          expect.assertions(4);
          // create user
          const { currentUser: user1 } = await loginAsNewlyCreatedUser(
            executor,
            setSub,
            'user1'
          );
          // create room
          const roomCreateResponse = await mutationRoomCreate(executor);
          expect(roomCreateResponse).toHaveProperty(
            'data.roomCreate',
            expect.objectContaining({
              id: expect.any(String),
              type: RoomType.Ephemeral,
              activeRound: null,
              occupants: expect.objectContaining({ length: 1 }),
            })
          );
          const roomBefore = roomCreateResponse.data?.roomCreate;
          // create deck
          const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
            input: {
              answerLang: 'en',
              cards: [],
              name: 'name',
              promptLang: 'en',
            },
          });
          const deckBefore = deckCreateResponse.data?.deckCreate;
          // set deck
          const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
            id: roomBefore?.id as string,
            deckId: deckBefore?.id as string,
          });
          expect(roomSetDeckResponse).toHaveProperty(
            'data.roomSetDeck',
            expect.objectContaining({
              id: roomBefore?.id as string,
              type: RoomType.Ephemeral,
              activeRound: {
                id: expect.any(String),
                deck: {
                  id: deckBefore?.id as string,
                },
                slug: expect.any(String),
                isActive: true,
                state: RoundState.Waiting,
              },
              occupants: [expect.objectContaining({ id: expect.any(String) })],
            })
          );
          // create user
          // the test should fail by commenting out exactly the below line
          await loginAsNewlyCreatedUser(executor, setSub, 'user2');
          // transition state
          const roomSetStateResponse = await mutationRoomStartRound(executor, {
            id: roomBefore?.id as string,
          });
          expect(roomSetStateResponse).toHaveProperty('data', null);
          expect(roomSetStateResponse.errors).not.toHaveLength(0);
        });
      });
    });
  });

  describe('Query', () => {
    describe('room', () => {
      it('should be able to return details of a room', async () => {
        expect.assertions(2);
        // create user
        const { currentUser: user } = await loginAsNewlyCreatedUser(
          executor,
          setSub
        );
        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;
        // query room
        const roomQueryResponse = await queryRoom(executor, {
          id: roomBefore?.id as string,
        });
        expect(roomQueryResponse).toHaveProperty(
          'data.room',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
      });
    });

    describe('occupyingUnarchivedRooms', () => {
      it('should be able to return ids of owned rooms and rooms you are occupying state', async () => {
        expect.assertions(5);
        // create owner user
        const { currentUser: user1 } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user1'
        );
        const user1gid = encodeGlobalID('User', user1.bareId);
        // create room
        const roomCreateResponse1 = await mutationRoomCreate(executor);
        const room1 = roomCreateResponse1.data?.roomCreate;
        // create room
        const roomCreateResponse2 = await mutationRoomCreate(executor);
        const room2 = roomCreateResponse2.data?.roomCreate;
        // create owner and occupant user
        const { currentUser: user2 } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user2'
        );
        const user2gid = encodeGlobalID('User', user2.bareId);
        expect(user2.bareId).not.toEqual(user1.bareId);
        // user2 befriends user1
        await mutationUserBefriendUser(executor, { befriendedId: user1gid });
        // user1 befriends user2
        setSub(user1);
        await mutationUserBefriendUser(executor, { befriendedId: user2gid });
        // create room
        setSub(user2);
        const roomCreateResponse3 = await mutationRoomCreate(executor);
        expect(roomCreateResponse3).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore3 = roomCreateResponse1.data?.roomCreate;
        // user2 joins room1
        const roomJoinResponse1 = await mutationRoomJoin(executor, {
          id: room1?.id as string,
        });
        expect(roomJoinResponse1).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 2 }),
          })
        );
        const roomBefore1 = roomJoinResponse1.data?.roomJoin;
        // user2 joins room2
        const roomJoinResponse2 = await mutationRoomJoin(executor, {
          id: room2?.id as string,
        });
        expect(roomJoinResponse2).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 2 }),
          })
        );
        const roomBefore2 = roomJoinResponse2.data?.roomJoin;
        // query room
        const occupyingUnarchivedRoomsResponse =
          await queryOccupyingUnarchivedRooms(executor);
        expect(occupyingUnarchivedRoomsResponse).toHaveProperty(
          'data.occupyingUnarchivedRooms',
          expect.arrayContaining([
            expect.objectContaining({ id: roomBefore1?.id }),
            expect.objectContaining({ id: roomBefore2?.id }),
            expect.objectContaining({ id: roomBefore3?.id }),
          ])
        );
      });
    });
  });

  describe('Subscription', () => {
    describe('roomUpdatesByRoomId', () => {
      it('should yield an appropriate integration event when the room it is subscribed to has roomSetDeck run on it', async () => {
        expect.assertions(4);
        // create user
        const { token } = await loginAsNewlyCreatedUser(executor, setSub);
        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;
        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse.data?.deckCreate;
        // we have to update our claims before we can establish a subscription
        const { currentUser } = await refreshLogin(executor, setSub, token);
        expect(Object.keys(currentUser.occupyingRoomSlugs)).toHaveLength(1);
        // create subscription
        const roomUpdates = await subscriptionRoomUpdatesByRoomId(executor, {
          id: roomBefore?.id as string,
        });
        const roomUpdatesIterator = roomUpdates[Symbol.asyncIterator]();
        // set deck
        /*
         * Note: we have to not just hook the subscription up
         * but also indicate that we are ready to receive the next event
         *   otherwise we will miss it.
         */
        const readResultP = roomUpdatesIterator.next();
        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore?.id as string,
            type: RoomType.Ephemeral,
            activeRound: {
              id: expect.any(String),
              deck: {
                id: deckBefore?.id as string,
              },
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            },
            occupants: [expect.objectContaining({ id: expect.any(String) })],
          })
        );
        const readResult = await readResultP;
        if (!readResult.done) {
          expect(readResult.value).toHaveProperty(
            'data.roomUpdatesByRoomId',
            expect.objectContaining({
              operation: RoomUpdateOperations.RoomSetDeck,
              value: {
                id: roomBefore?.id as string,
                type: RoomType.Ephemeral,
                activeRound: {
                  id: expect.any(String),
                  deck: {
                    id: deckBefore?.id as string,
                  },
                  slug: expect.any(String),
                  isActive: true,
                  state: RoundState.Waiting,
                },
                occupants: [
                  expect.objectContaining({ id: expect.any(String) }),
                ],
              },
            })
          );
        }
        await roomUpdatesIterator.return?.();
      });
      it('should yield an appropriate integration event when the room it is subscribed to has roomJoin run on it', async () => {
        expect.assertions(4);
        // create occupant user
        const { currentUser: occupantBefore } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user2'
        );
        const occupantBeforegid = encodeGlobalID('User', occupantBefore.bareId);
        // create owner user
        const { token, currentUser: ownerUser } = await loginAsNewlyCreatedUser(
          executor,
          setSub,
          'user1'
        );
        const ownerUsergid = encodeGlobalID('User', ownerUser.bareId);
        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;
        // we have to update our claims before we can establish a subscription
        const { currentUser } = await refreshLogin(executor, setSub, token);
        expect(Object.keys(currentUser.occupyingRoomSlugs)).toHaveLength(1);
        // create subscription
        const roomUpdates = await subscriptionRoomUpdatesByRoomId(executor, {
          id: roomBefore?.id as string,
        });
        const roomUpdatesIterator = roomUpdates[Symbol.asyncIterator]();
        const readResultP = roomUpdatesIterator.next();
        // owner befriends occupant-to-be
        await mutationUserBefriendUser(executor, {
          befriendedId: occupantBeforegid,
        });
        // occupant-to-be befriends owner
        setSub(occupantBefore);
        await mutationUserBefriendUser(executor, {
          befriendedId: ownerUsergid,
        });
        // add occupant to room
        const roomJoinResponse = await mutationRoomJoin(executor, {
          id: roomBefore?.id as string,
        });
        expect(roomJoinResponse).toHaveProperty(
          'data.roomJoin',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 2 }),
          })
        );
        // assert subscription result
        const readResult = await readResultP;
        if (!readResult.done) {
          expect(readResult.value).toHaveProperty(
            'data.roomUpdatesByRoomId',
            expect.objectContaining({
              operation: RoomUpdateOperations.RoomJoin,
              value: {
                id: expect.any(String),
                type: RoomType.Ephemeral,
                activeRound: null,
                occupants: expect.objectContaining({ length: 2 }),
              },
            })
          );
        }
        await roomUpdatesIterator.return?.();
      });
      it('should yield an appropriate integration event when the room it is subscribed to starts a round', async () => {
        expect.assertions(6);
        // create user
        const { currentUser: user, token } = await loginAsNewlyCreatedUser(
          executor,
          setSub
        );
        const usergid = encodeGlobalID('User', user.bareId);
        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          'data.roomCreate',
          expect.objectContaining({
            id: expect.any(String),
            type: RoomType.Ephemeral,
            activeRound: null,
            occupants: expect.objectContaining({ length: 1 }),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;
        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(executor, {
          input: {
            answerLang: 'en',
            cards: [],
            name: 'name',
            promptLang: 'en',
          },
        });
        const deckBefore = deckCreateResponse.data?.deckCreate;
        // we have to update our claims before we can establish a subscription
        const { currentUser } = await refreshLogin(executor, setSub, token);
        expect(Object.keys(currentUser.occupyingRoomSlugs)).toHaveLength(1);
        // create subscription
        const roomUpdates = await subscriptionRoomUpdatesByRoomId(executor, {
          id: roomBefore?.id as string,
        });
        const roomUpdatesIterator = roomUpdates[Symbol.asyncIterator]();
        const readResultOneP = roomUpdatesIterator.next();
        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(executor, {
          id: roomBefore?.id as string,
          deckId: deckBefore?.id as string,
        });
        expect(roomSetDeckResponse).toHaveProperty(
          'data.roomSetDeck',
          expect.objectContaining({
            id: roomBefore?.id,
            type: RoomType.Ephemeral,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Waiting,
            }),
            occupants: [expect.objectContaining({ id: usergid })],
          })
        );
        // assert subscription result for deck
        const readResultOne = await readResultOneP;
        if (!readResultOne.done) {
          expect(readResultOne.value).toHaveProperty(
            'data.roomUpdatesByRoomId',
            expect.objectContaining({
              operation: RoomUpdateOperations.RoomSetDeck,
              value: {
                id: roomBefore?.id,
                type: RoomType.Ephemeral,
                activeRound: expect.objectContaining({
                  id: expect.any(String),
                  slug: expect.any(String),
                  isActive: true,
                  state: RoundState.Waiting,
                }),
                occupants: [expect.objectContaining({ id: usergid })],
              },
            })
          );
        }
        const readResultTwoP = roomUpdatesIterator.next();
        // transition state
        const roomStartRoundResponse = await mutationRoomStartRound(executor, {
          id: roomBefore?.id as string,
        });
        expect(roomStartRoundResponse).toHaveProperty(
          'data.roomStartRound',
          expect.objectContaining({
            id: roomBefore?.id,
            type: RoomType.Ephemeral,
            activeRound: expect.objectContaining({
              id: expect.any(String),
              slug: expect.any(String),
              isActive: true,
              state: RoundState.Playing,
            }),
            occupants: [expect.objectContaining({ id: usergid })],
          })
        );
        // assert subscription result
        const readResultTwo = await readResultTwoP;
        if (!readResultTwo.done) {
          expect(readResultTwo.value).toHaveProperty(
            'data.roomUpdatesByRoomId',
            expect.objectContaining({
              operation: RoomUpdateOperations.RoomStartRound,
              value: {
                id: roomBefore?.id,
                type: RoomType.Ephemeral,
                activeRound: expect.objectContaining({
                  id: expect.any(String),
                  slug: expect.any(String),
                  isActive: true,
                  state: RoundState.Playing,
                }),
                occupants: [expect.objectContaining({ id: usergid })],
              },
            })
          );
        }
        await roomUpdatesIterator.return?.();
      });
    });
  });
});
