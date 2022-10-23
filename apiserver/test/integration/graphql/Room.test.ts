/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";

import { cascadingDelete } from "../_helpers/truncate";
import { loginAsNewlyCreatedUser } from "../../helpers/graphql/User.util";
import { mutationDeckCreateEmpty, testContextFactory } from "../../helpers";
import type { CurrentUser } from "../../../src/types";
import { YogaInitialContext } from "graphql-yoga";
import { Context } from "../../../src/context";
import { WrServer, createGraphQLApp } from "../../../src/graphqlApp";
import { mutationRoomAddOccupant, mutationRoomCreate, mutationRoomSetDeck, mutationRoomSetState, queryOccupyingRooms, queryRoom } from "../../helpers/graphql/Room.util";
import { RoomState } from "../../../generated/typescript-operations";
import cuid from "cuid";

describe("graphql/Room.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let app: WrServer;

  beforeAll(() => {
    [setSub, , context, stopContext, { prisma }] = testContextFactory();
    app = createGraphQLApp({ context, logging: false });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    await cascadingDelete(prisma).user;
  });

  describe.only("Mutation", () => {
    describe("roomAddOccupant", () => {
      it("should be able to add an occupant to an owned empty room in WAITING state", async () => {
        expect.assertions(2);

        // create occupant user
        const occupantBefore = await loginAsNewlyCreatedUser(app, setSub, "user2");

        // create owner user
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // add occupant to room
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: roomBefore.id, occupantId: occupantBefore.id });
        expect(roomAddOccupantResponse).toHaveProperty("data.roomAddOccupant", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }, { id: occupantBefore.id }]),
        }));
      });

      it("should be able to re-add an occupant to a room in WAITING state with no apparent change in state", async () => {
        expect.assertions(2);

        // create occupant user
        const occupantBefore = await loginAsNewlyCreatedUser(app, setSub, "user2");

        // create owner user
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        const room = roomCreateResponse.data.roomCreate;

        // add occupant to room
        const roomAddOccupantResponse1 = await mutationRoomAddOccupant(app, { id: room.id, occupantId: occupantBefore.id });
        expect(roomAddOccupantResponse1).toHaveProperty("data.roomAddOccupant", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }, { id: occupantBefore.id }]),
        }));
        const roomBefore = roomAddOccupantResponse1.data.roomAddOccupant;

        // re-add occupant to room
        const roomAddOccupantResponse2 = await mutationRoomAddOccupant(app, { id: roomBefore.id, occupantId: occupantBefore.id });
        expect(roomAddOccupantResponse2).toHaveProperty("data.roomAddOccupant", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }, { id: occupantBefore.id }]),
        }));
      });

      it("should fail to add a missing occupant to a room in WAITING state", async () => {
        expect.assertions(3);

        // create owner user
        const user = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // add occupant to room
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: roomBefore.id, occupantId: cuid() });
        expect(roomAddOccupantResponse).toHaveProperty("data", null);
        expect(roomAddOccupantResponse.errors).not.toHaveLength(0);
      });

      it("should fail to add an occupant to a room not in WAITING state, even if the occupant is the owner or already present", async () => {
        expect.assertions(3);

        // create user
        const userBefore = await loginAsNewlyCreatedUser(app, setSub, "user1");

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        const room = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deck = deckCreateResponse.data.deckCreate;

        // set deck
        await mutationRoomSetDeck(app, { id: room.id, deckId: deck.id });

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, { id: room.id, state: RoomState.Serving });
        expect(roomSetStateResponse).toHaveProperty("data.roomSetState", expect.objectContaining({
          id: room.id,
          state: RoomState.Serving,
          ownerId: userBefore.id,
          deckId: deck.id,
          deck: {
            id: deck.id,
          },
        }));
        const roomBefore = roomSetStateResponse.data.roomSetState;

        // add occupant
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: roomBefore.id, occupantId: userBefore.id });
        expect(roomAddOccupantResponse).toHaveProperty("data", null);
        expect(roomAddOccupantResponse.errors).not.toHaveLength(0);
      });

      it("should fail to add an occupant to a missing room", async () => {
        expect.assertions(2);

        // create occupant user
        const occupantBefore = await loginAsNewlyCreatedUser(app, setSub);
        const response = await mutationRoomAddOccupant(app, { id: cuid(), occupantId: occupantBefore.id });
        expect(response).toHaveProperty("data", null);
        expect(response.errors).not.toHaveLength(0);
      });

      it("should fail to add an occupant to an owned room if not authenticated as the owner, occupant, or the person being added", async () => {
        expect.assertions(3);

        // create occupant user
        await loginAsNewlyCreatedUser(app, setSub);
        const occupantBefore = await loginAsNewlyCreatedUser(app, setSub, "occupantBefore");

        // create room owner user
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create current user
        await loginAsNewlyCreatedUser(app, setSub, "currentUserBefore");
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: roomBefore.id, occupantId: occupantBefore.id });
        expect(roomAddOccupantResponse).toHaveProperty("data", null);
        expect(roomAddOccupantResponse.errors).not.toHaveLength(0);
      });
    });

    describe.skip("roomAddOccupantByName", () => {
      it("should be able to add an occupant to an empty room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
      it("should be able to add multiple occupant to an empty room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
      it("should be able to re-add an occupant to a room in WAITING state with no apparent change in state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add a missing occupant to a room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an occupant to a room not in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an occupant to a missing room", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an occupant to an owned room if not authenticated as the owner, occupant, or the person being added", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });
    });

    describe.skip("roomCleanUpDead", () => {
      // TODO: implement
    });

    describe("roomCreate", () => {
      it("should be able to create an empty room in WAITING state", async () => {
        expect.assertions(1);
        const user = await loginAsNewlyCreatedUser(app, setSub);
        const response = await mutationRoomCreate(app);
        expect(response).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
      });
    });

    describe.skip("roomEditOwnerConfig", () => {
      // TODO: implement
    });

    describe("roomSetDeck", () => {
      it("should be able to set the deck of an owned room in WAITING state", async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: deckBefore.id });
        expect(roomSetDeckResponse).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));
      });

      it("should be able to re-set the same deck of an owned room in WAITING state with no apparent change in state", async () => {
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
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(app, { id: room.id, deckId: deckBefore.id });
        expect(roomSetDeckResponseBefore).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));
        const roomBefore = roomSetDeckResponseBefore.data.roomSetDeck;

        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: deckBefore.id });
        expect(roomSetDeckResponse).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));
      });

      it("should be able to change the deck of a room in WAITING state", async () => {
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
        const roomSetDeckResponseBefore = await mutationRoomSetDeck(app, { id: room.id, deckId: deck1.id });
        expect(roomSetDeckResponseBefore).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck1.id,
          deck: {
            id: deck1.id,
          },
        }));
        const roomBefore = roomSetDeckResponseBefore.data.roomSetDeck;

        // set second deck
        const roomSetDeckResponse2 = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: deckBefore.id });
        expect(roomSetDeckResponse2).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));
      });

      it("should fail to add a missing deck to a room in WAITING state", async () => {
        expect.assertions(3);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: cuid() });
        expect(roomSetDeckResponse).toHaveProperty("data", null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });

      it.skip("should fail to add a deck to a room not in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
         */
      });

      it("should fail to add an deck to a missing room", async () => {
        expect.assertions(2);

        // create user
        await loginAsNewlyCreatedUser(app, setSub);

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: cuid(), deckId: deckBefore.id });
        expect(roomSetDeckResponse).toHaveProperty("data", null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });

      it("should fail to add a deck to an owned room if not authenticated as the owner of the room", async () => {
        expect.assertions(3);

        // create room owner user
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          deck: null,
          deckId: null,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create other user
        await loginAsNewlyCreatedUser(app, setSub, "user2");

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: deckBefore.id });
        expect(roomSetDeckResponse).toHaveProperty("data", null);
        expect(roomSetDeckResponse.errors).not.toHaveLength(0);
      });
    });

    describe("roomSetState", () => {
      it("should transition the state of an owned room in WAITING state to SERVING state with the deck set", async () => {
        expect.assertions(3);
        // create user
        const user = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: deckBefore.id });
        expect(roomSetDeckResponse).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, { id: roomBefore.id, state: RoomState.Serving });
        expect(roomSetStateResponse).toHaveProperty("data.roomSetState", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Serving,
          ownerId: user.id,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));
      });

      it("should fail to transition the state of an owned room in WAITING state to SERVING state without any deck set", async () => {
        expect.assertions(3);
        // create user
        const user = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
          deckId: null,
          deck: null,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, { id: roomBefore.id, state: RoomState.Serving });
        expect(roomSetStateResponse).toHaveProperty("data", null);
        expect(roomSetStateResponse.errors).not.toHaveLength(0);
      });

      it("should fail to transition the state of an another user's room in WAITING state to SERVING state", async () => {
        expect.assertions(4);
        // create user
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // create deck
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deckBefore = deckCreateResponse.data.deckCreate;

        // set deck
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: roomBefore.id, deckId: deckBefore.id });
        expect(roomSetDeckResponse).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          deckId: deckBefore.id,
          deck: {
            id: deckBefore.id,
          },
        }));

        // create user
        await loginAsNewlyCreatedUser(app, setSub, "user2");

        // transition state
        const roomSetStateResponse = await mutationRoomSetState(app, { id: roomBefore.id, state: RoomState.Serving });
        expect(roomSetStateResponse).toHaveProperty("data", null);
        expect(roomSetStateResponse.errors).not.toHaveLength(0);
      });
    });
  });

  describe("Query", () => {
    describe("room", () => {
      it("should be able to return details of a room", async () => {
        expect.assertions(2);

        // create user
        const user = await loginAsNewlyCreatedUser(app, setSub);

        // create room
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
        const roomBefore = roomCreateResponse.data.roomCreate;

        // query room
        const roomQueryResponse = await queryRoom(app, roomBefore.id);
        expect(roomQueryResponse).toHaveProperty("data.room", expect.objectContaining({
          id: roomBefore.id,
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
      });
    });
  });

  describe("occupyingRooms", () => {
    it("should be able to return ids of owned rooms and rooms you are occupying state", async () => {
      expect.assertions(4);
      // create owner user
      const user1 = await loginAsNewlyCreatedUser(app, setSub);

      // create room
      const roomCreateResponse1 = await mutationRoomCreate(app);
      const room1 = roomCreateResponse1.data.roomCreate;

      // create room
      const roomCreateResponse2 = await mutationRoomCreate(app);
      const room2 = roomCreateResponse2.data.roomCreate;

      // create owner and occupant user
      const user2 = await loginAsNewlyCreatedUser(app, setSub);

      // create room
      const roomCreateResponse3 = await mutationRoomCreate(app);
      expect(roomCreateResponse3).toHaveProperty("data.roomCreate", expect.objectContaining({
        id: expect.any(String),
        state: RoomState.Waiting,
        ownerId: user1.id,
      }));
      const roomBefore3 = roomCreateResponse1.data.roomCreate;

      const roomAddOccupantResponse1 = await mutationRoomAddOccupant(app, { id: room1.id, occupantId: user2.id });
      expect(roomAddOccupantResponse1).toHaveProperty("data.roomAddOccupant", expect.objectContaining({
        id: room1.id,
        state: RoomState.Waiting,
        ownerId: user1.id,
      }));
      const roomBefore1 = roomAddOccupantResponse1.data.roomAddOccupant;
      const roomAddOccupantResponse2 = await mutationRoomAddOccupant(app, { id: room2.id, occupantId: user2.id });
      expect(roomAddOccupantResponse2).toHaveProperty("data.roomAddOccupant", expect.objectContaining({
        id: room2.id,
        state: RoomState.Waiting,
        ownerId: user1.id,
      }));
      const roomBefore2 = roomAddOccupantResponse2.data.roomAddOccupant;

      // query room
      const occupyingRoomsResponse = await queryOccupyingRooms(app);
      expect(occupyingRoomsResponse).toHaveProperty("data.occupyingRooms", expect.arrayContaining([
        { id: roomBefore1.id },
        { id: roomBefore2.id },
        { id: roomBefore3.id },
      ]));
    });
  });
});
