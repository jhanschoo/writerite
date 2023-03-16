/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PrismaClient } from '@prisma/client';

import { cascadingDelete } from '../_helpers/truncate';
import { loginAsNewlyCreatedUser } from '../../helpers/graphql/User.util';
import {
  isoTimestampMatcher,
  mutationDeckCreateEmpty,
  queryDeckScalars,
  queryDecks,
  testContextFactory,
} from '../../helpers';
import { YogaInitialContext } from 'graphql-yoga';
import { Context } from '../../../src/context';
import { createGraphQLApp } from '../../../src/graphqlApp';
import { CurrentUser } from '../../../src/service/userJWT';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';

describe('graphql/Deck.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma }] = testContextFactory();
    const server = createGraphQLApp({ context, logging: false });
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
    describe('deckAddSubdeck', () => {
      // TODO: implement
    });

    describe('deckCreate', () => {
      it('should be able to create an empty deck', async () => {
        expect.assertions(1);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create deck
        const response = await mutationDeckCreateEmpty(executor);
        expect(response).toHaveProperty(
          'data.deckCreate',
          expect.objectContaining({
            id: expect.any(String),
          })
        );
      });
    });
    describe('deckDelete', () => {
      // TODO: implement
    });
    describe('deckEdit', () => {
      // TODO: implement
    });
    describe('deckRemoveSubdeck', () => {
      // TODO: implement
    });
    describe('deckUsed', () => {
      // TODO: implement
    });
  });

  describe('Query', () => {
    describe('deck', () => {
      it('should be able to return scalars of an owned deck', async () => {
        expect.assertions(2);

        // create user
        const { currentUser: user } = await loginAsNewlyCreatedUser(executor, setSub);

        // create deck
        const createDeckResponse = await mutationDeckCreateEmpty(executor);
        expect(createDeckResponse).toHaveProperty('data.deckCreate', {
          id: expect.any(String),
          answerLang: '',
          description: null,
          editedAt: expect.stringMatching(isoTimestampMatcher),
          name: '',
          ownerId: user.id,
          promptLang: '',
          published: false,
          sortData: [],
        });
        const deckBefore = createDeckResponse.data.deckCreate;

        // query deck
        const queryDeckResponse = await queryDeckScalars(executor, deckBefore.id);
        expect(queryDeckResponse).toHaveProperty('data.deck', {
          id: deckBefore.id,
          answerLang: '',
          description: null,
          editedAt: deckBefore.editedAt,
          name: '',
          ownerId: user.id,
          promptLang: '',
          published: false,
          sortData: [],
          usedAt: deckBefore.usedAt,
        });
      });
    });

    describe('decks', () => {
      it('should be able to return ids of owned decks', async () => {
        expect.assertions(3);

        // create user
        await loginAsNewlyCreatedUser(executor, setSub);

        // create deck 1
        const createDeckResponse1 = await mutationDeckCreateEmpty(executor);
        expect(createDeckResponse1).toHaveProperty(
          'data.deckCreate',
          expect.objectContaining({
            id: expect.any(String),
          })
        );
        const deckBefore1 = createDeckResponse1.data.deckCreate;

        // create deck 2
        const createDeckResponse2 = await mutationDeckCreateEmpty(executor);
        expect(createDeckResponse2).toHaveProperty(
          'data.deckCreate',
          expect.objectContaining({
            id: expect.any(String),
          })
        );
        const deckBefore2 = createDeckResponse2.data.deckCreate;

        // query decks
        const queryDeckResponse = await queryDecks(executor);
        expect(queryDeckResponse).toHaveProperty(
          'data.decks',
          expect.arrayContaining([
            expect.objectContaining({ id: deckBefore1.id }),
            expect.objectContaining({ id: deckBefore2.id }),
          ])
        );
      });
    });
  });
});
