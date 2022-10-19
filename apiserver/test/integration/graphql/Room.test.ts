/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";

import { cascadingDelete } from "../_helpers/truncate";
import { loginAsNewlyCreatedUser } from "../../helpers/graphql/User.util";
import { mutationDeckCreateEmpty, testContextFactory } from "../../helpers";
import type { CurrentUser } from "../../../src/types";
import { YogaInitialContext } from "graphql-yoga";
import { Context } from "../../../src/context";
import { WrServer, createGraphQLApp } from "../../../src/graphqlApp";
import { mutationRoomAddOccupant, mutationRoomCreate, mutationRoomSetDeck } from "../../helpers/graphql/Room.util";
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
        const user2 = await loginAsNewlyCreatedUser(app, setSub, "user2");
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        const room1 = roomCreateResponse.body!.data!.roomCreate;
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: room1.id, occupantId: user2.id });
        const room2 = roomAddOccupantResponse.body!.data!.roomAddOccupant;
        expect(room2).toEqual(expect.objectContaining({
          id: room1.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }, { id: user2.id }]),
        }));
      });
      it("should be able to re-add an occupant to a room in WAITING state with no apparent change in state", async () => {
        expect.assertions(3);
        const user2 = await loginAsNewlyCreatedUser(app, setSub, "user2");
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        const room1 = roomCreateResponse.body!.data!.roomCreate;
        const roomAddOccupantResponse1 = await mutationRoomAddOccupant(app, { id: room1.id, occupantId: user2.id });
        const room2 = roomAddOccupantResponse1.body!.data!.roomAddOccupant;
        expect(room2).toEqual(expect.objectContaining({
          id: room1.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          occupants: expect.arrayContaining([{ id: user1.id }, { id: user2.id }]),
        }));
        const roomAddOccupantResponse2 = await mutationRoomAddOccupant(app, { id: room1.id, occupantId: user2.id });
        const room3 = roomAddOccupantResponse2.body!.data!.roomAddOccupant;
        expect(room3).toEqual(expect.objectContaining({
          id: room1.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }, { id: user2.id }]),
        }));
      });
      it("should fail to add a missing occupant to a room in WAITING state", async () => {
        expect.assertions(3);
        const user = await loginAsNewlyCreatedUser(app, setSub);
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room1 = roomCreateResponse.body!.data!.roomCreate;
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: room1.id, occupantId: cuid() });
        expect(roomAddOccupantResponse).toHaveProperty("body.data", null);
        expect(roomAddOccupantResponse.body?.errors?.length).toBeTruthy();
      });
      it.skip("should fail to add an occupant to a room not in WAITING state", async () => {
        // no-op
      });
      it("should fail to add an occupant to a missing room", async () => {
        expect.assertions(2);
        const user = await loginAsNewlyCreatedUser(app, setSub);
        const response = await mutationRoomAddOccupant(app, { id: cuid(), occupantId: user.id });
        expect(response).toHaveProperty("body.data", null);
        expect(response.body?.errors?.length).toBeTruthy();
      });
      it("should fail to add an occupant to an owned room if not authenticated as the owner, occupant, or the person being added", async () => {
        expect.assertions(3);
        await loginAsNewlyCreatedUser(app, setSub);
        const user2 = await loginAsNewlyCreatedUser(app, setSub, "user2");
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room1 = roomCreateResponse.body!.data!.roomCreate;
        await loginAsNewlyCreatedUser(app, setSub, "user3");
        const roomAddOccupantResponse = await mutationRoomAddOccupant(app, { id: room1.id, occupantId: user2.id });
        expect(roomAddOccupantResponse).toHaveProperty("body.data", null);
        expect(roomAddOccupantResponse.body?.errors?.length).toBeTruthy();
      });
    });
    describe.skip("roomAddOccupantByName", () => {
      it("should be able to add an occupant to an empty room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should be able to add multiple occupant to an empty room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should be able to re-add an occupant to a room in WAITING state with no apparent change in state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add a missing occupant to a room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an occupant to a room not in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an occupant to a missing room", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an occupant to an owned room if not authenticated as the owner, occupant, or the person being added", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
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
        expect(response).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        await loginAsNewlyCreatedUser(app, setSub);
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        const room = roomCreateResponse.body!.data!.roomCreate;
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        const deck = deckCreateResponse.body!.data!.deckCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: room.id, deckId: deck.id });
        expect(roomSetDeckResponse).toHaveProperty("body.data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck.id,
          deck: {
            id: deck.id,
          },
        }));
      });
      it("should be able to re-set the same deck of an owned room in WAITING state with no apparent change in state", async () => {
        expect.assertions(3);
        await loginAsNewlyCreatedUser(app, setSub);
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = roomCreateResponse.body!.data!.roomCreate;
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = deckCreateResponse.body!.data!.deckCreate;
        const roomSetDeckResponse1 = await mutationRoomSetDeck(app, { id: room.id, deckId: deck.id });
        expect(roomSetDeckResponse1).toHaveProperty("body.data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck.id,
          deck: {
            id: deck.id,
          },
        }));
        const roomSetDeckResponse2 = await mutationRoomSetDeck(app, { id: room.id, deckId: deck.id });
        expect(roomSetDeckResponse2).toHaveProperty("body.data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck.id,
          deck: {
            id: deck.id,
          },
        }));
      });
      it("should be able to change the deck of a room in WAITING state", async () => {
        expect.assertions(3);
        await loginAsNewlyCreatedUser(app, setSub);
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = roomCreateResponse.body!.data!.roomCreate;
        const deckCreateResponse1 = await mutationDeckCreateEmpty(app);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck1 = deckCreateResponse1.body!.data!.deckCreate;
        const roomSetDeckResponse1 = await mutationRoomSetDeck(app, { id: room.id, deckId: deck1.id });
        expect(roomSetDeckResponse1).toHaveProperty("body.data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck1.id,
          deck: {
            id: deck1.id,
          },
        }));
        const deckCreateResponse2 = await mutationDeckCreateEmpty(app);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck2 = deckCreateResponse2.body!.data!.deckCreate;
        const roomSetDeckResponse2 = await mutationRoomSetDeck(app, { id: room.id, deckId: deck2.id });
        expect(roomSetDeckResponse2).toHaveProperty("body.data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck2.id,
          deck: {
            id: deck2.id,
          },
        }));
      });
      it("should fail to add a missing deck to a room in WAITING state", async () => {
        expect.assertions(3);
        await loginAsNewlyCreatedUser(app, setSub);
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = roomCreateResponse.body!.data!.roomCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: room.id, deckId: cuid() });
        expect(roomSetDeckResponse).toHaveProperty("body.data", null);
        expect(roomSetDeckResponse.body?.errors?.length).toBeTruthy();
      });
      it.skip("should fail to add a deck to a room not in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(app, setSub);
        /*
         * const response = await mutationDeckCreateEmpty(server);
         * expect(response).toHaveProperty("body.data.deckCreate.id", expect.any(String));
         */
      });
      it("should fail to add an deck to a missing room", async () => {
        expect.assertions(2);
        await loginAsNewlyCreatedUser(app, setSub);
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = deckCreateResponse.body!.data!.deckCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: cuid(), deckId: deck.id });
        expect(roomSetDeckResponse).toHaveProperty("body.data", null);
        expect(roomSetDeckResponse.body?.errors?.length).toBeTruthy();
      });

      it("should fail to add a deck to an owned room if not authenticated as the owner of the room", async () => {
        expect.assertions(3);
        const user1 = await loginAsNewlyCreatedUser(app, setSub, "user1");
        const roomCreateResponse = await mutationRoomCreate(app);
        expect(roomCreateResponse).toHaveProperty("body.data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = roomCreateResponse.body!.data!.roomCreate;
        const user2 = await loginAsNewlyCreatedUser(app, setSub, "user2");
        const deckCreateResponse = await mutationDeckCreateEmpty(app);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = deckCreateResponse.body!.data!.deckCreate;
        const roomSetDeckResponse = await mutationRoomSetDeck(app, { id: room.id, deckId: deck.id });
        expect(roomSetDeckResponse).toHaveProperty("body.data", null);
        expect(roomSetDeckResponse.body?.errors?.length).toBeTruthy();
      });
    });
  });

  describe.skip("Query", () => {
    describe("room", () => {
      it("should be able to return details of an owned room", async () => {
        // expect.assertions(1);
        // const currentUser = await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
        // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        // const { id } = createDeckExecutionResult!.data!.deckCreate;
        // const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
        // expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
        //   id,
        //   answerLang: "",
        //   description: {},
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //   editedAt: expect.stringMatching(isoTimestampMatcher),
        //   name: "",
        //   ownerId: currentUser.id,
        //   promptLang: "",
        //   published: false,
        //   sortData: [],
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //   usedAt: expect.stringMatching(isoTimestampMatcher),
      });
      it("should be able to return details of a room you are occupying", async () => {
        expect.assertions(1);
        // const currentUser = await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
        // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        // const { id } = createDeckExecutionResult!.data!.deckCreate;
        // const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
        // expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
        //   id,
        //   answerLang: "",
        //   description: {},
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //   editedAt: expect.stringMatching(isoTimestampMatcher),
        //   name: "",
        //   ownerId: currentUser.id,
        //   promptLang: "",
        //   published: false,
        //   sortData: [],
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //   usedAt: expect.stringMatching(isoTimestampMatcher),
      });
    });
  });

  describe("rooms", () => {
    it("should be able to return ids of owned rooms and rooms you are occupying", () => {
      expect.assertions(1);
    });
  });
});
