/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Deck, PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import { mutationDeckAddSubdeck, mutationDeckCreateEmpty, mutationDeckEditName, mutationDeckRemoveSubdeck, mutationDeckUsed, queryDeckScalars, queryDecks, testContextFactory } from "../../helpers";
import { CurrentUser, Roles } from "../../../src/types";
import { WrServer, createGraphQLApp } from "../../../src/graphqlApp";
import { PubSub, YogaInitialContext, createPubSub } from "graphql-yoga";
import { Context, PubSubPublishArgsByKey } from "../../../src/context";

export const DEFAULT_CURRENT_USER = {
  id: "fake-id",
  name: "fake-name",
  roles: [Roles.user],
};

describe("graphql/Deck.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let server: WrServer;
  let redis: DeepMockProxy<Redis>;
  let setPubsub: (pubsub: PubSub<PubSubPublishArgsByKey>) => void;

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;
    redis = mockDeep<Redis>();
    [setSub, setPubsub, context, stopContext] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub: createPubSub(),
      redis,
    });
    server = createGraphQLApp({ context });
  });

  afterAll(async () => {
    await stopContext();
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
        const response = await mutationDeckAddSubdeck(server, { id, subdeckId });
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
        expect(response).toHaveProperty("body.data.deckAddSubdeck.id", id);
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
        const response = await mutationDeckCreateEmpty(server);
        expect(response).toHaveProperty("body.data.deckCreate.id", id);
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
        const response = await mutationDeckEditName(server, { id, name: nextName });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.updateMany).toHaveBeenCalledWith({
          where: { id, ownerId: DEFAULT_CURRENT_USER.id },
          data: {
            name: nextName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            editedAt: expect.any(Date),
          },
        });
        expect(response).toHaveProperty("body.data.deckEdit.name", nextName);
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
        const response = await mutationDeckRemoveSubdeck(server, { id, subdeckId });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            subdecks: { delete: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } } },
          },
        });
        expect(response).toHaveProperty("body.data.deckRemoveSubdeck.id", id);
      });
    });
    describe("deckUsed", () => {
      it("should ask the db to update the usedAt field of a deck to a recent time", async () => {
        const id = "deck-id-with-20-plus-chars";
        setSub(DEFAULT_CURRENT_USER);
        prisma.user.findMany.mockResolvedValue([]);
        prisma.deck.count.mockResolvedValue(1);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const response = await mutationDeckUsed(server, { id });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith(expect.objectContaining({
          where: { id },
          data: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            usedAt: expect.any(Date),
          },
        }));
        expect(response).toHaveProperty("body.data.deckUsed.id", id);
      });
    });
  });

  describe.skip("Query", () => {
    describe("deck", () => {
      it("should be able to return scalars of an owned deck", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const createDeckResponse = await mutationDeckCreateEmpty(server);
        const id = createDeckResponse.body.data!.deckCreate.id as string;
        const queryDeckResponse = await queryDeckScalars(server, id);
        expect(queryDeckResponse).toHaveProperty("body.data.deck", {
          id,
          answerLang: "",
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
      it("should be able to return ids of ownedSignJWT decks", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const createDeckResponse1 = await mutationDeckCreateEmpty(server);
        const id1 = createDeckResponse1.body.data!.deckCreate.id as string;
        const createDeckResponse2 = await mutationDeckCreateEmpty(server);
        const id2 = createDeckResponse2.body.data!.deckCreate.id;
        const queryDecksResponse = await queryDecks(server);
        expect(queryDecksResponse).toHaveProperty("body.data.decks", expect.arrayContaining([
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
