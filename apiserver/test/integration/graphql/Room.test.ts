import { PrismaClient } from "@prisma/client";

import { cascadingDelete } from "../_helpers/truncate";
import { loginAsNewlyCreatedUser } from "../../helpers/graphql/User.util";
import { mutationDeckCreateEmpty, testContextFactory } from "../../helpers";
import type { CurrentUser } from "../../../src/types";
import { YogaInitialContext } from "@graphql-yoga/node";
import { Context } from "../../../src/context";
import { WrServer, graphQLServerFactory } from "../../../src/graphqlServer";
import { mutationRoomAddOccupant, mutationRoomCreate, mutationRoomSetDeck } from "../../helpers/graphql/Room.util";
import { RoomState } from "../../../generated/typescript-operations";
import cuid from "cuid";

describe("graphql/Room.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let server: WrServer;

  beforeAll(() => {
    [setSub, , context, stopContext, { prisma }] = testContextFactory();
    server = graphQLServerFactory({ context, logging: false });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await Promise.allSettled([server.stop(), stopContext()]);
  });

  afterEach(async () => {
    await cascadingDelete(prisma).user;
  });

  describe.only("Mutation", () => {
    describe("roomAddOccupant", () => {
      it("should be able to add an occupant to an owned empty room in WAITING state", async () => {
        expect.assertions(2);
        const user2 = await loginAsNewlyCreatedUser(server, setSub, "user2");
        const user1 = await loginAsNewlyCreatedUser(server, setSub, "user1");
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room1 = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultRoomAddOccupant } = await mutationRoomAddOccupant(server, { id: room1.id, occupantId: user2.id });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room2 = executionResultRoomAddOccupant!.data!.roomAddOccupant;
        expect(room2).toEqual(expect.objectContaining({
          id: room1.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }, { id: user2.id }]),
        }));
      });
      it("should be able to re-add an occupant to a room in WAITING state with no apparent change in state", async () => {
        expect.assertions(3);
        const user2 = await loginAsNewlyCreatedUser(server, setSub, "user2");
        const user1 = await loginAsNewlyCreatedUser(server, setSub, "user1");
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room1 = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultRoomAddOccupant1 } = await mutationRoomAddOccupant(server, { id: room1.id, occupantId: user2.id });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room2 = executionResultRoomAddOccupant1!.data!.roomAddOccupant;
        expect(room2).toEqual(expect.objectContaining({
          id: room1.id,
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }, { id: user2.id }]),
        }));
        const { executionResult: executionResultRoomAddOccupant2 } = await mutationRoomAddOccupant(server, { id: room1.id, occupantId: user2.id });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room3 = executionResultRoomAddOccupant2!.data!.roomAddOccupant;
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
        const user = await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user.id,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room1 = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultRoomAddOccupant } = await mutationRoomAddOccupant(server, { id: room1.id, occupantId: cuid() });
        expect(executionResultRoomAddOccupant).toHaveProperty("data", null);
        expect(executionResultRoomAddOccupant?.errors?.length).toBeTruthy();
      });
      it.skip("should fail to add an occupant to a room not in WAITING state", async () => {
        // no-op
      });
      it("should fail to add an occupant to a missing room", async () => {
        expect.assertions(2);
        const user = await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult } = await mutationRoomAddOccupant(server, { id: cuid(), occupantId: user.id });
        expect(executionResult).toHaveProperty("data", null);
        expect(executionResult?.errors?.length).toBeTruthy();
      });
      it("should fail to add an occupant to an owned room if not authenticated as the owner, occupant, or the person being added", async () => {
        expect.assertions(3);
        await loginAsNewlyCreatedUser(server, setSub);
        const user2 = await loginAsNewlyCreatedUser(server, setSub, "user2");
        const user1 = await loginAsNewlyCreatedUser(server, setSub, "user1");
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          occupants: expect.arrayContaining([{ id: user1.id }]),
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room1 = executionResultRoomCreate!.data!.roomCreate;
        await loginAsNewlyCreatedUser(server, setSub, "user3");
        const { executionResult } = await mutationRoomAddOccupant(server, { id: room1.id, occupantId: user2.id });
        expect(executionResult).toHaveProperty("data", null);
        expect(executionResult?.errors?.length).toBeTruthy();
      });
    });
    describe.skip("roomAddOccupantByName", () => {
      it("should be able to add an occupant to an empty room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should be able to add multiple occupant to an empty room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should be able to re-add an occupant to a room in WAITING state with no apparent change in state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should fail to add a missing occupant to a room in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should fail to add an occupant to a room not in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should fail to add an occupant to a missing room", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should fail to add an occupant to an owned room if not authenticated as the owner, occupant, or the person being added", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
    });
    describe.skip("roomCleanUpDead", () => {
      // TODO: implement
    });
    describe("roomCreate", () => {
      it("should be able to create an empty room in WAITING state", async () => {
        expect.assertions(1);
        const user = await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult } = await mutationRoomCreate(server);
        expect(executionResult).toHaveProperty("data.roomCreate", expect.objectContaining({
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
        await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultDeckCreate } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = executionResultDeckCreate!.data!.deckCreate;
        const { executionResult: executionResultRoomSetDeck } = await mutationRoomSetDeck(server, { id: room.id, deckId: deck.id });
        expect(executionResultRoomSetDeck).toHaveProperty("data.roomSetDeck", expect.objectContaining({
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
        await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultDeckCreate } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = executionResultDeckCreate!.data!.deckCreate;
        const { executionResult: executionResultRoomSetDeck1 } = await mutationRoomSetDeck(server, { id: room.id, deckId: deck.id });
        expect(executionResultRoomSetDeck1).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck.id,
          deck: {
            id: deck.id,
          },
        }));
        const { executionResult: executionResultRoomSetDeck2 } = await mutationRoomSetDeck(server, { id: room.id, deckId: deck.id });
        expect(executionResultRoomSetDeck2).toHaveProperty("data.roomSetDeck", expect.objectContaining({
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
        await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultDeckCreate1 } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck1 = executionResultDeckCreate1!.data!.deckCreate;
        const { executionResult: executionResultRoomSetDeck1 } = await mutationRoomSetDeck(server, { id: room.id, deckId: deck1.id });
        expect(executionResultRoomSetDeck1).toHaveProperty("data.roomSetDeck", expect.objectContaining({
          id: room.id,
          state: RoomState.Waiting,
          deckId: deck1.id,
          deck: {
            id: deck1.id,
          },
        }));
        const { executionResult: executionResultDeckCreate2 } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck2 = executionResultDeckCreate2!.data!.deckCreate;
        const { executionResult: executionResultRoomSetDeck2 } = await mutationRoomSetDeck(server, { id: room.id, deckId: deck2.id });
        expect(executionResultRoomSetDeck2).toHaveProperty("data.roomSetDeck", expect.objectContaining({
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
        await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = executionResultRoomCreate!.data!.roomCreate;
        const { executionResult: executionResultRoomSetDeck } = await mutationRoomSetDeck(server, { id: room.id, deckId: cuid() });
        expect(executionResultRoomSetDeck).toHaveProperty("data", null);
        expect(executionResultRoomSetDeck?.errors?.length).toBeTruthy();
      });
      it.skip("should fail to add a deck to a room not in WAITING state", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        // const { executionResult } = await mutationDeckCreateEmpty(server);
        // expect(executionResult).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
      it("should fail to add an deck to a missing room", async () => {
        expect.assertions(2);
        await loginAsNewlyCreatedUser(server, setSub);
        const { executionResult: executionResultDeckCreate } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = executionResultDeckCreate!.data!.deckCreate;
        const { executionResult: executionResultRoomSetDeck } = await mutationRoomSetDeck(server, { id: cuid(), deckId: deck.id });
        expect(executionResultRoomSetDeck).toHaveProperty("data", null);
        expect(executionResultRoomSetDeck?.errors?.length).toBeTruthy();
      });

      it("should fail to add a deck to an owned room if not authenticated as the owner of the room", async () => {
        expect.assertions(3);
        const user1 = await loginAsNewlyCreatedUser(server, setSub, "user1");
        const { executionResult: executionResultRoomCreate } = await mutationRoomCreate(server);
        expect(executionResultRoomCreate).toHaveProperty("data.roomCreate", expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          state: RoomState.Waiting,
          ownerId: user1.id,
          deck: null,
          deckId: null,
        }));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const room = executionResultRoomCreate!.data!.roomCreate;
        const user2 = await loginAsNewlyCreatedUser(server, setSub, "user2");
        const { executionResult: executionResultDeckCreate } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deck = executionResultDeckCreate!.data!.deckCreate;
        const { executionResult: executionResultRoomSetDeck } = await mutationRoomSetDeck(server, { id: room.id, deckId: deck.id });
        expect(executionResultRoomSetDeck).toHaveProperty("data", null);
        expect(executionResultRoomSetDeck?.errors?.length).toBeTruthy();
      });
    });
  });

  describe.skip("Query", () => {
    describe("room", () => {
      // it("should be able to return details of an owned room", async () => {
      //   expect.assertions(1);
      //   // const currentUser = await loginAsNewlyCreatedUser(server, setSub);
      //   // const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
      //   // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //   // const { id } = createDeckExecutionResult!.data!.deckCreate;
      //   // const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
      //   // expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
      //   //   id,
      //   //   answerLang: "",
      //   //   description: {},
      //   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   //   editedAt: expect.stringMatching(isoTimestampMatcher),
      //   //   name: "",
      //   //   ownerId: currentUser.id,
      //   //   promptLang: "",
      //   //   published: false,
      //   //   sortData: [],
      //   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   //   usedAt: expect.stringMatching(isoTimestampMatcher),
      // });
      // it("should be able to return details of a room you are occupying", async () => {
      //     expect.assertions(1);
      //     // const currentUser = await loginAsNewlyCreatedUser(server, setSub);
      //     // const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
      //     // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //     // const { id } = createDeckExecutionResult!.data!.deckCreate;
      //     // const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
      //     // expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
      //     //   id,
      //     //   answerLang: "",
      //     //   description: {},
      //     //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //     //   editedAt: expect.stringMatching(isoTimestampMatcher),
      //     //   name: "",
      //     //   ownerId: currentUser.id,
      //     //   promptLang: "",
      //     //   published: false,
      //     //   sortData: [],
      //     //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //     //   usedAt: expect.stringMatching(isoTimestampMatcher),
      //   });
      // });
    });

    describe("rooms", () => {
      it("should be able to return ids of owned rooms and rooms you are occupying", async () => {
        expect.assertions(1);
      });
    });
  });
});
