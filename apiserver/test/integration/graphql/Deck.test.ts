/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from "@prisma/client";

import { cascadingDelete } from "../_helpers/truncate";
import { loginAsNewlyCreatedUser } from "../../helpers/graphql/User.util";
import { isoTimestampMatcher, mutationDeckCreateEmpty, queryDeckScalars, queryDecks, testContextFactory } from "../../helpers";
import type { CurrentUser } from "../../../src/types";
import { YogaInitialContext } from "graphql-yoga";
import { Context } from "../../../src/context";
import { WrServer, createGraphQLApp } from "../../../src/graphqlApp";

describe("graphql/Deck.ts", () => {

  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let server: WrServer;

  beforeAll(() => {
    [setSub, , context, stopContext, { prisma }] = testContextFactory();
    server = createGraphQLApp({ context, logging: false });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    await cascadingDelete(prisma).user;
  });

  describe("Mutation", () => {
    describe("deckAddSubdeck", () => {
      // TODO: implement
    });
    describe("deckCreate", () => {
      it("should be able to create an empty deck", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        const response = await mutationDeckCreateEmpty(server);
        expect(response).toHaveProperty("data.deckCreate.id", expect.any(String));
      });
    });
    describe("deckDelete", () => {
      // TODO: implement
    });
    describe("deckEdit", () => {
      // TODO: implement
    });
    describe("deckRemoveSubdeck", () => {
      // TODO: implement
    });
    describe("deckUsed", () => {
      // TODO: implement
    });
  });

  describe("Query", () => {
    describe("deck", () => {
      it("should be able to return scalars of an owned deck", async () => {
        expect.assertions(1);
        const currentUser = await loginAsNewlyCreatedUser(server, setSub);
        const createDeckResponse = await mutationDeckCreateEmpty(server);
        const id = createDeckResponse.data.deckCreate.id as string;
        const queryDeckResponse = await queryDeckScalars(server, id);
        expect(queryDeckResponse).toHaveProperty("data.deck", {
          id,
          answerLang: "",
          description: {},
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          editedAt: expect.stringMatching(isoTimestampMatcher),
          name: "",
          ownerId: currentUser.id,
          promptLang: "",
          published: false,
          sortData: [],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          usedAt: expect.stringMatching(isoTimestampMatcher),
        });
      });
    });

    describe("decks", () => {
      it("should be able to return ids of owned decks", async () => {
        expect.assertions(1);
        await loginAsNewlyCreatedUser(server, setSub);
        const createDeckResponse1 = await mutationDeckCreateEmpty(server);
        const id1 = createDeckResponse1.data.deckCreate.id as string;
        const createDeckResponse2 = await mutationDeckCreateEmpty(server);
        const id2 = createDeckResponse2.data.deckCreate.id as string;
        const queryDeckResponse = await queryDecks(server);
        expect(queryDeckResponse).toHaveProperty("data.decks", expect.arrayContaining([
          { id: id1 },
          { id: id2 },
        ]));
      });
    });
  });
});
