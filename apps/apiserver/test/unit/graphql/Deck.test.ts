/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Deck, PrismaClient, User } from "database";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import Redis from "ioredis";

import {
  mutationDeckAddSubdeck,
  mutationDeckCreateEmpty,
  mutationDeckEditName,
  mutationDeckRemoveSubdeck,
  queryDeckBasic,
  queryDecks,
  testContextFactory,
} from "../../helpers";
import { createGraphQLApp } from "../../../src/server";
import { YogaInitialContext, createPubSub } from "graphql-yoga";
import { Context } from "../../../src/context";
import { CurrentUser, Roles } from "../../../src/service/userJWT";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { encodeGlobalID } from "@pothos/plugin-relay";

export const DEFAULT_CURRENT_USER = {
  id: "fake-id",
  name: "fake-name",
  roles: [Roles.User],
  occupyingRoomSlugs: {},
};
export const DEFAULT_CURRENT_USER_GID = encodeGlobalID(
  "User",
  DEFAULT_CURRENT_USER.id
);

describe("graphql/Deck.ts", () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let executor: ReturnType<typeof buildHTTPExecutor>;
  let redis: DeepMockProxy<Redis>;
  const pubsub = createPubSub();

  // eslint-disable-next-line @typescript-eslint/require-await
  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>();
    redis = mockDeep<Redis>();
    [setSub, context, stopContext] = testContextFactory({
      prisma: prisma as unknown as PrismaClient,
      pubsub,
      redis,
    });
    const server = createGraphQLApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
  });

  afterAll(async () => {
    await stopContext();
  });

  afterEach(() => {
    setSub();
    mockReset(prisma);
    mockReset(redis);
  });

  describe.skip("Mutation", () => {
    describe("deckAddSubdeck", () => {
      it("should proxy requests to add a subdeck to a deck to the db, and return the parent deck", async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = "parent-id-with-20-plus-chars";
        const subdeckId = "child-id-with-20-plus-chars";
        const gid = encodeGlobalID("Deck", id);
        const gsubdeckId = encodeGlobalID("Deck", subdeckId);
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.count.mockResolvedValue(2);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const response = await mutationDeckAddSubdeck(executor, {
          deckId: gid,
          subdeckId: gsubdeckId,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            subdecks: {
              connectOrCreate: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                where: {
                  parentDeckId_subdeckId: { parentDeckId: id, subdeckId },
                },
                create: { subdeck: { connect: { id: subdeckId } } },
              },
            },
          },
        });
        expect(response).toHaveProperty("data.deckAddSubdeck.id", id);
      });
    });
    describe("deckCreate", () => {
      it("should proxy requests to create an empty deck to the db, and return the created empty deck", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const id = "fake-id-with-20-plus-chars";
        const gid = encodeGlobalID("Deck", id);
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.create.mockResolvedValue({
          id,
        } as Deck);
        const response = await mutationDeckCreateEmpty(executor, {
          answerLang: "en",
          cards: [],
          name: "name",
          promptLang: "en",
        });
        expect(response).toHaveProperty("data.deckCreate.id", gid);
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
        const gid = encodeGlobalID("Deck", id);
        const nextName = "next-name";
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.updateMany.mockResolvedValue({
          count: 1,
        });
        prisma.deck.findUnique.mockResolvedValue({
          id,
          name: nextName,
        } as Deck);
        const response = await mutationDeckEditName(executor, {
          id: gid,
          name: nextName,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.updateMany).toHaveBeenCalledWith({
          where: { id, ownerId: DEFAULT_CURRENT_USER.id },
          data: {
            name: nextName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            editedAt: expect.any(Date),
          },
        });
        expect(response).toHaveProperty("data.deckEdit.name", nextName);
      });
    });
    describe("deckRemoveSubdeck", () => {
      it("should proxy requests to remove a subdeck relationship between decks to the db, and return the parent deck", async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = "parent-id-with-20-plus-chars";
        const gid = encodeGlobalID("Deck", id);
        const subdeckId = "child-id-with-20-plus-chars";
        const gsubdeckId = encodeGlobalID("Deck", subdeckId);
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.count.mockResolvedValue(2);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const response = await mutationDeckRemoveSubdeck(executor, {
          deckId: gid,
          subdeckId: gsubdeckId,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            subdecks: {
              delete: {
                parentDeckId_subdeckId: { parentDeckId: id, subdeckId },
              },
            },
          },
        });
        expect(response).toHaveProperty("data.deckRemoveSubdeck.id", id);
      });
    });
  });

  describe("Query", () => {
    describe("deck", () => {
      it("should be able to return scalars of an owned deck", async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const id = "deck-id-with-20-plus-chars";
        prisma.user.findUnique.mockResolvedValue({ name: "abc" } as User);
        prisma.deck.findUnique.mockResolvedValue({
          id,
          ownerId: DEFAULT_CURRENT_USER.id,
          owner: {
            id: DEFAULT_CURRENT_USER.id as unknown,
          },
          name: "",
          description: {},
          promptLang: "",
          answerLang: "",
          published: false,
          editedAt: new Date(),
          sortData: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Deck & { owner: { id: string } });
        const queryDeckResponse = await queryDeckBasic(executor, {
          id: encodeGlobalID("Deck", id),
        });
        expect(queryDeckResponse).toHaveProperty("data.deck", {
          answerLang: "",
          description: {},
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          editedAt: expect.any(String),
          owner: {
            id: DEFAULT_CURRENT_USER_GID,
          },
          name: "",
          promptLang: "",
          published: false,
          sortData: [],
        });
      });
    });

    describe("decks", () => {
      it("should be able to return ids of ownedSignJWT decks", async () => {
        expect.assertions(1);
        const id1 = "deck-id-with-20-plus-chars-1";
        const id2 = "deck-id-with-20-plus-chars-2";
        setSub(DEFAULT_CURRENT_USER);
        prisma.user.findUnique.mockResolvedValue({ name: "abc" } as User);
        prisma.deck.findMany.mockResolvedValue([
          { id: id1 } as Deck,
          { id: id2 } as Deck,
        ]);
        const queryDecksResponse = await queryDecks(executor, {});
        expect(queryDecksResponse.data?.decks.edges).toHaveLength(2);
      });
    });
  });
});
