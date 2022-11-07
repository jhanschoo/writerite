/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Deck, PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import Redis from 'ioredis';

import {
  mutationDeckAddSubdeck,
  mutationDeckCreateEmpty,
  mutationDeckEditName,
  mutationDeckRemoveSubdeck,
  mutationDeckUsed,
  queryDeckScalars,
  queryDecks,
  testContextFactory,
} from '../../helpers';
import { WrServer, createGraphQLApp } from '../../../src/graphqlApp';
import { YogaInitialContext, createPubSub } from 'graphql-yoga';
import { Context } from '../../../src/context';
import { CurrentUser, Roles } from '../../../src/service/userJWT';

export const DEFAULT_CURRENT_USER = {
  id: 'fake-id',
  name: 'fake-name',
  roles: [Roles.User],
  occupyingActiveRoomSlugs: [],
};

describe('graphql/Deck.ts', () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: DeepMockProxy<PrismaClient>;
  let server: WrServer;
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
    server = createGraphQLApp({ context, logging: false });
  });

  afterAll(async () => {
    await stopContext();
  });

  afterEach(() => {
    setSub();
    mockReset(prisma);
    mockReset(redis);
  });

  describe.skip('Mutation', () => {
    describe('deckAddSubdeck', () => {
      it('should proxy requests to add a subdeck to a deck to the db, and return the parent deck', async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = 'parent-id-with-20-plus-chars';
        const subdeckId = 'child-id-with-20-plus-chars';
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.count.mockResolvedValue(2);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const response = await mutationDeckAddSubdeck(server, { id, subdeckId });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            subdecks: {
              connectOrCreate: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                where: { parentDeckId_subdeckId: { parentDeckId: id, subdeckId } },
                create: { subdeck: { connect: { id: subdeckId } } },
              },
            },
          },
        });
        expect(response).toHaveProperty('data.deckAddSubdeck.id', id);
      });
    });
    describe('deckCreate', () => {
      it('should proxy requests to create an empty deck to the db, and return the created empty deck', async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const id = 'fake-id-with-20-plus-chars';
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.create.mockResolvedValue({
          id,
        } as Deck);
        const response = await mutationDeckCreateEmpty(server);
        expect(response).toHaveProperty('data.deckCreate.id', id);
      });
    });
    describe('deckDelete', () => {
      it.skip('should proxy requests to delete empty decks to the DB, and return the id of the deleted deck', async () => {
        // TODO: implement
      });
      it.skip('should proxy requests to delete decks to the DB by asking it to delete the deck and cards and user records associated with it, and return the id of the deleted deck', async () => {
        // TODO: implement
      });
      // TODO: implement
    });
    describe('deckEdit', () => {
      it('should be able to change the name of a deck, and retrieve the updated state with a further call', async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = 'fake-id-with-20-plus-chars';
        const nextName = 'next-name';
        prisma.user.findUnique.mockResolvedValue(null);
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
        expect(response).toHaveProperty('data.deckEdit.name', nextName);
      });
    });
    describe('deckRemoveSubdeck', () => {
      it('should proxy requests to remove a subdeck relationship between decks to the db, and return the parent deck', async () => {
        expect.assertions(2);
        setSub(DEFAULT_CURRENT_USER);
        const id = 'parent-id-with-20-plus-chars';
        const subdeckId = 'child-id-with-20-plus-chars';
        prisma.user.findUnique.mockResolvedValue(null);
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
        expect(response).toHaveProperty('data.deckRemoveSubdeck.id', id);
      });
    });
    describe('deckUsed', () => {
      it('should ask the db to update the usedAt field of a deck to a recent time', async () => {
        const id = 'deck-id-with-20-plus-chars';
        setSub(DEFAULT_CURRENT_USER);
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.deck.count.mockResolvedValue(1);
        prisma.deck.update.mockResolvedValue({ id } as Deck);
        const response = await mutationDeckUsed(server, { id });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(prisma.deck.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id },
            data: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              usedAt: expect.any(Date),
            },
          })
        );
        expect(response).toHaveProperty('data.deckUsed.id', id);
      });
    });
  });

  describe('Query', () => {
    describe('deck', () => {
      it('should be able to return scalars of an owned deck', async () => {
        expect.assertions(1);
        setSub(DEFAULT_CURRENT_USER);
        const id = 'deck-id-with-20-plus-chars';
        prisma.user.findUnique.mockResolvedValue({ name: "abc" } as User);
        prisma.deck.findUnique.mockResolvedValue({
          id,
          answerLang: '',
          description: {},
          editedAt: new Date(),
          name: '',
          ownerId: DEFAULT_CURRENT_USER.id,
          promptLang: '',
          published: false,
          sortData: [],
          usedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const queryDeckResponse = await queryDeckScalars(server, id);
        expect(queryDeckResponse).toHaveProperty('data.deck', {
          id,
          answerLang: '',
          description: {},
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          editedAt: expect.any(String),
          name: '',
          ownerId: DEFAULT_CURRENT_USER.id,
          promptLang: '',
          published: false,
          sortData: [],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          usedAt: expect.any(String),
        });
      });
    });

    describe('decks', () => {
      it('should be able to return ids of ownedSignJWT decks', async () => {
        expect.assertions(1);
        const id1 = 'deck-id-with-20-plus-chars-1';
        const id2 = 'deck-id-with-20-plus-chars-2';
        setSub(DEFAULT_CURRENT_USER);
        prisma.user.findUnique.mockResolvedValue({ name: "abc" } as User);
        prisma.deck.findMany.mockResolvedValue([{ id: id1 } as Deck, { id: id2 } as Deck]);
        const queryDecksResponse = await queryDecks(server);
        expect(queryDecksResponse.data.decks).toHaveLength(2);
      });
    });
  });
});
