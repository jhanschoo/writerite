import type { Deck, PrismaClient, User } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import { mutationDeckAddSubdeck, mutationDeckCreateEmpty, mutationDeckEditName, mutationDeckRemoveSubdeck, queryDeckScalars, queryDecks, testContextFactory, mutationDeckUsed } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { WrServer, graphQLServerFactory } from "../../../src/graphqlServer";
import { PubSub, YogaInitialContext, createPubSub } from "@graphql-yoga/node";
import { Context, PubSubPublishArgsByKey } from "../../../src/context";

export const DEFAULT_CURRENT_USER = {
  id: "fake-id",
  name: "fake-name",
  roles: [Roles.user],
};

describe("graphql/Deck.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Context;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let server: WrServer;
  let redis: DeepMockProxy<Redis.Redis>;
  let setPubsub: (pubsub: PubSub<PubSubPublishArgsByKey>) => void;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;
    redis = mockDeep<Redis.Redis>();
    [setSub, setPubsub, context, stopContext] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub: createPubSub(),
      redis,
    });
    server = graphQLServerFactory({ context });
  });

  afterAll(async () => {
    await Promise.allSettled([server.stop(), stopContext()]);
  });

  afterEach(() => {
    setSub();
    setPubsub(createPubSub());
    mockReset(prisma);
    mockReset(redis);
  });

  describe("Mutation", () => {
    describe("deckAddSubdeck", () => {
      it("should proxy requests to add a subdeck to a deck to the db, and return the parent deck", async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = "parent-id-with-20-plus-chars";
        const subdeckId = "child-id-with-20-plus-chars";
        prisma.user.findMany.mockResolvedValue([]);
        prisma.deck.count.mockResolvedValue(2);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const { executionResult } = await mutationDeckAddSubdeck(server, { id, subdeckId });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            subdecks: { connectOrCreate: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              where: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } },
              create: { subdeck: { connect: { id: subdeckId } } },
            } },
          },
        });
        expect(executionResult).toHaveProperty("data.deckAddSubdeck.id", id);
      });
    });
    describe("deckCreate", () => {
      it("should proxy requests to create an empty deck to the db, and return the created empty deck", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const id = "fake-id-with-20-plus-chars";
        prisma.user.findMany.mockResolvedValue([]);
        prisma.deck.create.mockResolvedValue({
          id,
        } as Deck);
        const { executionResult } = await mutationDeckCreateEmpty(server);
        expect(executionResult).toHaveProperty("data.deckCreate.id", id);
      });
    });
    describe("deckDelete", () => {
      it.skip("should proxy requests to delete empty decks to the DB, and return the id of the deleted deck", async () => {
        // TODO: implement
      });
      it.skip("should proxy requests to delete decks to the DB by asking it to delete the deck and cards and user records associated with it, and return the id of the deleted deck", async () => {
        // TODO: implement
      });
      // TODO: implement
    });
    describe("deckEdit", () => {
      it("should be able to change the name of a deck, and retrieve the updated state with a further call", async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = "fake-id-with-20-plus-chars";
        const nextName = "next-name";
        prisma.user.findMany.mockResolvedValue([]);
        prisma.deck.updateMany.mockResolvedValue({
          count: 1,
        });
        prisma.deck.findUnique.mockResolvedValue({
          id,
          name: nextName,
        } as Deck);
        const { executionResult } = await mutationDeckEditName(server, { id, name: nextName });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.updateMany).toHaveBeenCalledWith({
          where: { id, ownerId: DEFAULT_CURRENT_USER.id },
          data: {
            name: nextName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            editedAt: expect.any(Date),
          },
        });
        expect(executionResult).toHaveProperty("data.deckEdit.name", nextName);
      });
    });
    describe("deckRemoveSubdeck", () => {
      it("should proxy requests to remove a subdeck relationship between decks to the db, and return the parent deck", async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = "parent-id-with-20-plus-chars";
        const subdeckId = "child-id-with-20-plus-chars";
        prisma.user.findMany.mockResolvedValue([]);
        prisma.deck.count.mockResolvedValue(2);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const { executionResult } = await mutationDeckRemoveSubdeck(server, { id, subdeckId });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            subdecks: { delete: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } } },
          },
        });
        expect(executionResult).toHaveProperty("data.deckRemoveSubdeck.id", id);
      });
    });
    describe("deckUsed", () => {
      it("should ask the db to update the usedAt field of a deck to a recent time", async () => {
        const id = "deck-id-with-20-plus-chars";
        setSub(DEFAULT_CURRENT_USER);
        prisma.user.findMany.mockResolvedValue([]);
        prisma.deck.count.mockResolvedValue(1);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const { executionResult } = await mutationDeckUsed(server, { id });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith(expect.objectContaining({
          where: { id },
          data: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            usedAt: expect.any(Date),
          },
        }));
        expect(executionResult).toHaveProperty("data.deckUsed.id", id);
      });
    });
  });

  describe.skip("Query", () => {
    describe("deck", () => {
      it("should be able to return scalars of an owned deck", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const { executionResult: createDeckExecutionResult } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { id } = createDeckExecutionResult!.data!.deckCreate;
        const { executionResult: queryDeckExecutionResult } = await queryDeckScalars(server, id);
        expect(queryDeckExecutionResult).toHaveProperty("data.deck", {
          id,
          answerLang: "",
          archived: false,
          description: {},
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          editedAt: expect.any(Date),
          name: "",
          ownerId: DEFAULT_CURRENT_USER.id,
          promptLang: "",
          published: false,
          sortData: [],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          usedAt: expect.any(Date),
        });
      });
    });

    describe.skip("decks", () => {
      it("should be able to return ids of owned, unarchived decks", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const { executionResult: createDeck1ExecutionResult } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const id1 = createDeck1ExecutionResult!.data!.deckCreate.id;
        const { executionResult: createDeck2ExecutionResult } = await mutationDeckCreateEmpty(server);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const id2 = createDeck2ExecutionResult!.data!.deckCreate.id;
        const queryDecksRes = await queryDecks(server);
        expect(queryDecksRes).toHaveProperty("data.decks", expect.arrayContaining([
          {
            id: id1,
          },
          {
            id: id2,
          },
        ]));
      });
    });
  });
});
