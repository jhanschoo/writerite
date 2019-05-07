import { GraphQLResolveInfo } from 'graphql';
import { MergeInfo } from 'graphql-tools';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

import { prisma, PDeck, PUser } from '../generated/prisma-client';
import { IRwContext } from '../src/types';

import { rwDeckQuery } from '../src/resolver/Query/RwDeck.query';
import { rwDeckMutation } from '../src/resolver/Mutation/RwDeck.mutation';
import { ContextParameters } from 'graphql-yoga/dist/types';

const { rwDeck, rwOwnDecks } = rwDeckQuery;
const { rwDeckCreate, rwDeckEdit, rwDeckDelete } = rwDeckMutation;

const req = {} as ContextParameters;
const redisClient = new Redis();
const pubsub = new RedisPubSub();
const baseCtx = { req, prisma, pubsub, redisClient } as IRwContext;
const baseInfo = {} as GraphQLResolveInfo & { mergeInfo: MergeInfo };

const EMAIL = 'abc@xyz';
const OTHER_EMAIL = 'def@xyz';
const NEW_EMAIL = 'ghi@xyz';
const NAME = 'oldDeck';
const OTHER_NAME = 'otherDeck';
const NEW_NAME = 'newDeck';

describe('RwDeck resolvers', async () => {
  let USER: PUser;
  let OTHER_USER: PUser;
  let DECK: PDeck;
  let OTHER_DECK: PDeck;
  const commonBeforeEach = async () => {
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
    USER = await prisma.createPUser({ email: EMAIL });
    OTHER_USER = await prisma.createPUser({ email: OTHER_EMAIL });
    DECK = await prisma.createPDeck({ name: NAME, owner: { connect: { id: USER.id } } });
    OTHER_DECK = await prisma.createPDeck({ name: OTHER_NAME, owner: { connect: { id: OTHER_USER.id } } });
  };
  const commonAfterEach = async () => {
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
  };

  beforeEach(async () => {
    await prisma.deleteManyPRoomMessages({});
    await prisma.deleteManyPRooms({});
    await prisma.deleteManyPCards({});
    await prisma.deleteManyPDecks({});
    await prisma.deleteManyPUsers({});
  });

  describe('rwOwnDecks', async () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return user\'s decks if they exist', async () => {
      expect.assertions(1);
      const retrievedDecks = await rwOwnDecks(null, {}, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo);
      expect(retrievedDecks).toContainEqual(expect.objectContaining({
        id: DECK.id,
      }));
    });
  });

  describe('rwDeck', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null on no deck present', () => {
      expect.assertions(1);
      expect(rwDeck(null, { id: '1234567' }, baseCtx, baseInfo))
        .resolves.toBeNull();
    });
    test('it should return deck if it exists', async () => {
      expect.assertions(1);
      const retrievedDeck = await rwDeck(
        null, { id: DECK.id }, baseCtx, baseInfo,
      );
      if (!retrievedDeck) {
        return null;
      }
      expect(retrievedDeck.id).toBe(DECK.id);
    });
  });

  describe('rwDeckCreate', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      expect(rwDeckCreate(null, { name: NAME }, baseCtx, baseInfo))
        .resolves.toBeNull();
    });
    test('it saves a deck', async () => {
      expect.assertions(4);
      const deckObj = await rwDeckCreate(null, { name: NEW_NAME }, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo);
      expect(deckObj).toHaveProperty('id');
      expect(deckObj).toHaveProperty('name', NEW_NAME);
      // work around typescript thinking deckNode may be null
      if (!deckObj) {
        return null;
      }
      expect(await prisma.pDeck({ id: deckObj.id })).toHaveProperty('name', NEW_NAME);
      expect(await prisma.pDeck({ id: deckObj.id }).owner().id()).toBe(USER.id);
    });
  });

  describe('rwDeckEdit', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(1);
      expect(rwDeckEdits(null, { name: NAME }, baseCtx, baseInfo))
        .resolves.toBeNull();
    });
    test('it should return null and not save/update if specifies a deck not owned by sub.id', async () => {
      expect.assertions(2);
      const otherDeckObj = await rwDeckEdit(
        null,
        { id: OTHER_DECK.id, name: NEW_NAME },
        { ...baseCtx, sub: { id: USER.id } } as IRwContext,
        baseInfo,
      );
      expect(otherDeckObj).toBeNull();
      expect(prisma.pDeck({ id: OTHER_DECK.id })).resolves.toHaveProperty('name', OTHER_NAME);
    });
    test('it updates a deck when id specifies a deck owned by sub.id', async () => {
      expect.assertions(4);
      const deckObj = await rwDeckEdit(null, { id: DECK.id, name: NEW_NAME }, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo);
      expect(deckObj).toHaveProperty('id');
      expect(deckObj).toHaveProperty('name', NEW_NAME);
      expect(prisma.pDeck({ id: DECK.id }).owner().id()).resolves.toBe(USER.id);
      expect(prisma.pDeck({ id: DECK.id }).name()).resolves.toBe(NEW_NAME);
    });
  });

  describe('rwDeckDelete', () => {
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);

    test('it should return null if sub is not present', async () => {
      expect.assertions(2);
      expect(rwDeckDelete(null, { id: DECK.id }, baseCtx, baseInfo))
        .resolves.toBeNull();
      const savedDeck = await prisma.pDeck({ id: DECK.id });
      expect(savedDeck).toHaveProperty('name', NAME);
    });
    test('it should return null if deck has differnet owner than sub.id', async () => {
      expect.assertions(2);
      expect(await rwDeckDelete(null, { id: OTHER_DECK.id }, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo)).toBeNull();
      const savedDeck = await prisma.pDeck({ id: OTHER_DECK.id });
      expect(savedDeck).toHaveProperty('name', OTHER_NAME);
    });
    test('it should delete and return deleted deck\'s id if deck has same owner than sub.id', async () => {
      expect.assertions(2);
      const deletedDeckId = await rwDeckDelete(null, { id: DECK.id }, {
        ...baseCtx, sub: { id: USER.id },
      } as IRwContext, baseInfo);
      expect(deletedDeckId).toEqual(DECK.id);
      expect(await prisma.pDeck({ id: DECK.id })).toBeNull();
    });
  });
});
