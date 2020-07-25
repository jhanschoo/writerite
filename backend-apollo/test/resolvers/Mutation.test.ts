import { JsonObject, PrismaClient } from "@prisma/client";
import type { GraphQLResolveInfo } from "graphql";
import type { MergeInfo } from "apollo-server-koa";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { Redis as RedisClient } from "ioredis";
import { ContentState, convertToRaw } from "draft-js";

import type { WrContext } from "../../src/types";
import { Mutation } from "../../src/resolver/Mutation";
import { Deck } from "../../src/resolver/Deck";
import { Room } from "../../src/resolver/Room";
import { User } from "../../src/resolver/User";
import { UserSS, userToSS } from "../../src/model/User";
import type { DeckSS } from "../../src/model/Deck";
import type { CardSS } from "../../src/model/Card";
import { RoomSS, roomToSS } from "../../src/model/Room";
import { ChatMsgContentType, ChatMsgSS, chatMsgToSS } from "../../src/model/ChatMsg";

let prisma: PrismaClient;

let redisClient: RedisClient;
let pubsub: RedisPubSub;
let baseCtx: WrContext;
let baseInfo: GraphQLResolveInfo & { mergeInfo: MergeInfo };

function rawFromText(text: string) {
  return convertToRaw(ContentState.createFromText(text)) as unknown as JsonObject;
}

beforeAll(() => {
  prisma = new PrismaClient();
  redisClient = new Redis();
  pubsub = new RedisPubSub();
  baseCtx = { prisma, fetchDepth: 3, pubsub, redisClient };
  baseInfo = {} as GraphQLResolveInfo & { mergeInfo: MergeInfo };
});

afterAll(async () => {
  await prisma.subdeck.deleteMany({});
  await prisma.occupant.deleteMany({});
  await prisma.userCardRecord.deleteMany({});
  await prisma.userDeckRecord.deleteMany({});
  await prisma.chatMsg.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.deck.deleteMany({});
  await prisma.user.deleteMany({});
  pubsub.close();
  await redisClient.quit();
  await prisma.disconnect();
});

beforeEach(async () => {
  await prisma.subdeck.deleteMany({});
  await prisma.occupant.deleteMany({});
  await prisma.userCardRecord.deleteMany({});
  await prisma.userDeckRecord.deleteMany({});
  await prisma.chatMsg.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.deck.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("Mutation resolvers", () => {

  const NIL_ID = "00000000-0000-0000-0000-000000000000";

  describe("User fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const NEW_EMAIL = "ghi@xyz";
    const OTHER_NAME = "Some Name";
    let USER: UserSS;
    let OTHER_USER: UserSS;

    beforeEach(async () => {
      USER = userToSS(await prisma.user.create({ data: { email: EMAIL } }));
      OTHER_USER = userToSS(await prisma.user.create({ data: { email: OTHER_EMAIL } }));
    });

    afterEach(async () => {
      await prisma.user.deleteMany({});
    });

    describe("Mutation.userEdit", () => {
      test("It should replace the name of current user and return it", async () => {
        expect.assertions(3);
        expect(await prisma.user.findOne({ where: { id: USER.id } })).toHaveProperty("name", null);
        const user = await Mutation.userEdit({}, { name: OTHER_NAME }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(user).toHaveProperty("name", OTHER_NAME);
        expect(await prisma.user.findOne({ where: { id: USER.id } })).toHaveProperty("name", OTHER_NAME);
      });

      test("It should do nothing and return null if user is not logged in", async () => {
        expect.assertions(3);
        expect(await prisma.user.findOne({ where: { id: USER.id } })).toHaveProperty("name", null);
        const user = await Mutation.userEdit({}, { name: OTHER_NAME }, baseCtx, baseInfo);
        expect(user).toBeNull();
        expect(await prisma.user.findOne({ where: { id: USER.id } })).toHaveProperty("name", null);
      });
    });
  });

  describe("Deck fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const NEW_EMAIL = "ghi@xyz";
    const NAME = "oldDeck";
    const OTHER_NAME = "otherDeck";
    const NEW_NAME = "newDeck";
    const NEW_CARD_PROMPT_1 = rawFromText("prompt1");
    const NEW_CARD_FULL_ANSWER_1 = rawFromText("answer1");
    const NEW_CARD_OTHER_ANSWER_1 = "otherAnswer1";
    const NEW_CARD_PROMPT_2 = rawFromText("prompt2");
    const NEW_CARD_FULL_ANSWER_2 = rawFromText("answer2");
    const NEW_CARDS = [
      {
        prompt: NEW_CARD_PROMPT_1,
        fullAnswer: NEW_CARD_FULL_ANSWER_1,
        answers: [NEW_CARD_OTHER_ANSWER_1],
      },
      {
        prompt: NEW_CARD_PROMPT_2,
        fullAnswer: NEW_CARD_FULL_ANSWER_2,
        answers: [],
      },
    ];
    let USER: UserSS;
    let OTHER_USER: UserSS;
    let DECK: DeckSS;
    let OTHER_DECK: DeckSS;

    beforeEach(async () => {
      USER = userToSS(await prisma.user.create({ data: {
        email: EMAIL,
      } }));
      OTHER_USER = userToSS(await prisma.user.create({ data: {
        email: OTHER_EMAIL,
      } }));
      DECK = await prisma.deck.create({ data: {
        name: NAME,
        owner: { connect: { id: USER.id } },
      } });
      OTHER_DECK = await prisma.deck.create({ data: {
        name: OTHER_NAME,
        owner: { connect: { id: OTHER_USER.id } },
      } });
    });

    afterEach(async () => {
      await prisma.subdeck.deleteMany({});
      await prisma.card.deleteMany({});
      await prisma.deck.deleteMany({});
      await prisma.user.deleteMany({});
    });

    describe("Mutation.deckCreate", () => {
      test("It should create a new deck owned by current user and return it", async () => {
        expect.assertions(4);
        const deck = await Mutation.deckCreate({}, {
          name: NEW_NAME,
        }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(deck).toHaveProperty("name", NEW_NAME);
        expect(deck).toHaveProperty("ownerId", USER.id);
        if (!deck) {
          return;
        }
        const pDeck = await prisma.deck.findOne({ where: { id: deck.id } });
        expect(pDeck).toHaveProperty("name", NEW_NAME);
        expect(pDeck).toHaveProperty("ownerId", USER.id);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(2);
        const deckCount = await prisma.deck.count({});
        const deck = await Mutation.deckCreate({}, {
          name: NEW_NAME,
        }, baseCtx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.count({})).toBe(deckCount);
      });
    });

    describe("Mutation.deckCreateFromRows", () => {
      test("It should create a new deck owned by user and return it if logged in, with the appropriate cards", async () => {
        expect.assertions(8);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckCreate({}, {
          name: NEW_NAME,
          cards: NEW_CARDS,
        }, ctx, baseInfo);
        expect(deck).toHaveProperty("name", NEW_NAME);
        expect(deck).toHaveProperty("ownerId", USER.id);
        if (!deck) {
          return;
        }
        const cards = await Deck.cards(deck, {}, ctx, baseInfo);
        expect(cards).toHaveLength(2);
        expect(cards).toEqual(expect.arrayContaining([
          expect.objectContaining({
            prompt: NEW_CARD_PROMPT_1,
            fullAnswer: NEW_CARD_FULL_ANSWER_1,
            answers: [NEW_CARD_OTHER_ANSWER_1],
          }),
          expect.objectContaining({
            prompt: NEW_CARD_PROMPT_2,
            fullAnswer: NEW_CARD_FULL_ANSWER_2,
          }),
        ]));
        const pDeck = await prisma.deck.findOne({ where: { id: deck.id } });
        expect(pDeck).toHaveProperty("name", NEW_NAME);
        expect(pDeck).toHaveProperty("ownerId", USER.id);
        const pCards = await prisma.card.findMany({ where: { deckId: deck.id } });
        expect(pCards).toHaveLength(2);
        expect(pCards).toEqual(expect.arrayContaining([
          expect.objectContaining({
            prompt: NEW_CARD_PROMPT_1,
            fullAnswer: NEW_CARD_FULL_ANSWER_1,
            answers: [NEW_CARD_OTHER_ANSWER_1],
          }),
          expect.objectContaining({
            prompt: NEW_CARD_PROMPT_2,
            fullAnswer: NEW_CARD_FULL_ANSWER_2,
          }),
        ]));
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(2);
        const deckCount = await prisma.deck.count({});
        const deck = await Mutation.deckCreate({}, {
          name: NEW_NAME,
          cards: NEW_CARDS,
        }, baseCtx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.count({})).toBe(deckCount);
      });
    });

    describe("Mutation.deckEdit", () => {
      test("It should return null if deck does not exist", async () => {
        expect.assertions(3);
        expect(await prisma.deck.findOne({ where: { id: NIL_ID } })).toBeNull();
        const deck = await Mutation.deckEdit({}, {
          id: NIL_ID,
          name: OTHER_NAME,
        }, { ...baseCtx, sub: USER }, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.findOne({ where: { id: NIL_ID } })).toBeNull();
      });

      test("It should edit a deck's scalars and return it if owned by current user", async () => {
        expect.assertions(3);
        expect(await prisma.deck.findOne({ where: { id: DECK.id } })).toHaveProperty("name", NAME);
        const deck = await Mutation.deckEdit({}, {
          id: DECK.id,
          name: OTHER_NAME,
        }, { ...baseCtx, sub: USER }, baseInfo);
        expect(deck).toHaveProperty("name", OTHER_NAME);
        expect(await prisma.deck.findOne({ where: { id: DECK.id } })).toHaveProperty("name", OTHER_NAME);
      });

      test("It should do nothing and return null if not owned by current user", async () => {
        expect.assertions(3);
        expect(await prisma.deck.findOne({ where: { id: DECK.id } })).toHaveProperty("name", NAME);
        const deck = await Mutation.deckEdit({}, {
          id: DECK.id,
          name: OTHER_NAME,
        }, { ...baseCtx, sub: OTHER_USER }, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.findOne({ where: { id: DECK.id } })).toHaveProperty("name", NAME);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(3);
        expect(await prisma.deck.findOne({ where: { id: DECK.id } })).toHaveProperty("name", NAME);
        const deck = await Mutation.deckEdit({}, {
          id: DECK.id,
          name: OTHER_NAME,
        }, baseCtx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.findOne({ where: { id: DECK.id } })).toHaveProperty("name", NAME);
      });
    });

    describe("Mutation.deckAddSubdeck", () => {
      test("It should add the subdeck if current user owns parent deck, returning the parent deck", async () => {
        expect.assertions(5);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toHaveProperty("id", DECK.id);
        if (!deck) {
          return;
        }
        const subdecks = await Deck.subdecks(deck, {}, ctx, baseInfo);
        expect(subdecks).toHaveLength(1);
        expect(subdecks).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: OTHER_DECK.id,
          }),
        ]));
        if (!subdecks) {
          return;
        }
        const [subdeck] = subdecks;
        if (!subdeck) {
          return;
        }
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
      });

      test("It should do nothing if user owns parent deck, parent-subdeck relation already exists, returning the parent deck", async () => {
        expect.assertions(5);
        const ctx = { ...baseCtx, sub: USER };
        await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toHaveProperty("id", DECK.id);
        if (!deck) {
          return;
        }
        const subdecks = await Deck.subdecks(deck, {}, ctx, baseInfo);
        expect(subdecks).toHaveLength(1);
        expect(subdecks).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: OTHER_DECK.id,
          }),
        ]));
        if (!subdecks) {
          return;
        }
        const [subdeck] = subdecks;
        if (!subdeck) {
          return;
        }
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
      });

      test("It should do nothing and return null if user doesn't own parent deck", async () => {
        expect.assertions(3);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: OTHER_USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });

      test("It should do nothing and return null if parent-subdeck relation already exists but user doesn't own parent deck", async () => {
        expect.assertions(3);
        await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, { ...baseCtx, sub: USER }, baseInfo);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
        const ctx = { ...baseCtx, sub: OTHER_USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
      });

      test("It should do nothing and return null if subdeck doesn't exist", async () => {
        expect.assertions(3);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: NIL_ID,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });

      test("It should do nothing and return null if parent deck doesn't exist", async () => {
        expect.assertions(3);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: NIL_ID, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });
    });

    describe("Mutation.deckRemoveSubdeck", () => {
      // TODO: whole describe under development
      test("It should remove the subdeck if current user owns parent deck, returning the parent deck", async () => {
        expect.assertions(4);
        await prisma.subdeck.create({ data: {
          parentDeck: { connect: { id: DECK.id } },
          subdeck: { connect: { id: OTHER_DECK.id } },
        } });
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckRemoveSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toHaveProperty("id", DECK.id);
        if (!deck) {
          return;
        }
        const subdecks = await Deck.subdecks(deck, {}, ctx, baseInfo);
        expect(subdecks).toHaveLength(0);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });

      test("It should do nothing if user owns parent deck, parent-subdeck relation already does not exist, returning the parent deck", async () => {
        expect.assertions(4);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckRemoveSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toHaveProperty("id", DECK.id);
        if (!deck) {
          return;
        }
        const subdecks = await Deck.subdecks(deck, {}, ctx, baseInfo);
        expect(subdecks).toHaveLength(0);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });

      test("It should do nothing and return null if user doesn't own parent deck", async () => {
        expect.assertions(3);
        await prisma.subdeck.create({ data: {
          parentDeck: { connect: { id: DECK.id } },
          subdeck: { connect: { id: OTHER_DECK.id } },
        } });
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
        const ctx = { ...baseCtx, sub: OTHER_USER };
        const deck = await Mutation.deckRemoveSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(1);
      });

      test("It should do nothing and return null if parent-subdeck relation already doesn't exist but user doesn't own parent deck", async () => {
        expect.assertions(3);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: OTHER_USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });

      test("It should do nothing and return null if subdeck doesn't exist", async () => {
        expect.assertions(3);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: DECK.id, subdeckId: NIL_ID,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });

      test("It should do nothing and return null if parent deck doesn't exist", async () => {
        expect.assertions(3);
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckAddSubdeck({}, {
          id: NIL_ID, subdeckId: OTHER_DECK.id,
        }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.subdeck.count({ where: {
          parentDeck: { id: DECK.id },
          subdeck: { id: OTHER_DECK.id },
        } })).toBe(0);
      });
    });

    describe("Mutation.deckDelete", () => {
      beforeEach(async () => {
        await prisma.subdeck.create({ data: {
          parentDeck: { connect: { id: DECK.id } },
          subdeck: { connect: { id: OTHER_DECK.id } },
        } });
      });

      test("It should delete a deck that current user owns, and return its scalars", async () => {
        expect.assertions(6);
        expect(await prisma.deck.count({ where: { id: DECK.id } })).toBe(1);
        expect(await prisma.subdeck.count({})).toBe(1);
        const ctx = { ...baseCtx, sub: USER };
        const deck = await Mutation.deckDelete({}, { id: DECK.id }, ctx, baseInfo);
        expect(deck).toHaveProperty("id", DECK.id);
        expect(deck).toHaveProperty("name", DECK.name);
        expect(await prisma.deck.count({ where: { id: DECK.id } })).toBe(0);
        expect(await prisma.subdeck.count({})).toBe(0);
      });

      test("It should not do anything, and return null if current user does not own deck", async () => {
        expect.assertions(5);
        const deckCount = await prisma.deck.count({});
        const subdeckCount = await prisma.subdeck.count({});
        expect(deckCount).toBeGreaterThan(0);
        expect(subdeckCount).toBeGreaterThan(0);
        const ctx = { ...baseCtx, sub: OTHER_USER };
        const deck = await Mutation.deckDelete({}, { id: DECK.id }, ctx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.count({})).toBe(deckCount);
        expect(await prisma.subdeck.count({})).toBe(subdeckCount);
      });

      test("It should not do anything, and return null if not logged in", async () => {
        expect.assertions(5);
        const deckCount = await prisma.deck.count({});
        const subdeckCount = await prisma.subdeck.count({});
        expect(deckCount).toBeGreaterThan(0);
        expect(subdeckCount).toBeGreaterThan(0);
        const deck = await Mutation.deckDelete({}, { id: DECK.id }, baseCtx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.count({})).toBe(deckCount);
        expect(await prisma.subdeck.count({})).toBe(subdeckCount);
      });

      test("It should not do anything, and return null if deck does not exist", async () => {
        expect.assertions(5);
        const deckCount = await prisma.deck.count({});
        const subdeckCount = await prisma.subdeck.count({});
        expect(deckCount).toBeGreaterThan(0);
        expect(subdeckCount).toBeGreaterThan(0);
        const deck = await Mutation.deckDelete({}, { id: NIL_ID }, baseCtx, baseInfo);
        expect(deck).toBeNull();
        expect(await prisma.deck.count({})).toBe(deckCount);
        expect(await prisma.subdeck.count({})).toBe(subdeckCount);
      });
    });
  });

  describe("Card fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const NEW_EMAIL = "ghi@xyz";
    const NAME = "oldDeck";
    const OTHER_NAME = "otherDeck";
    const NEXT_NAME = "nextDeck";
    const NEW_NAME = "newDeck";
    const PROMPT = "prompt";
    const FULL_ANSWER = "fullAnswer";
    const NEXT_PROMPT = rawFromText("prompt");
    const NEXT_FULL_ANSWER = rawFromText("fullAnswer");
    const OTHER_PROMPT = rawFromText("otherPrompt");
    const OTHER_FULL_ANSWER = rawFromText("otherFullAnswer");
    const NEW_PROMPT = rawFromText("newPrompt");
    const NEW_FULL_ANSWER = rawFromText("newFullAnswer");
    let USER: UserSS;
    let OTHER_USER: UserSS;
    let DECK: DeckSS;
    let NEXT_DECK: DeckSS;
    let OTHER_DECK: DeckSS;
    let CARD: CardSS;
    let NEXT_CARD: CardSS;
    let OTHER_CARD: CardSS;

    beforeEach(async () => {
      USER = userToSS(await prisma.user.create({ data: {
        email: EMAIL,
      } }));
      OTHER_USER = userToSS(await prisma.user.create({ data: {
        email: OTHER_EMAIL,
      } }));
      DECK = await prisma.deck.create({ data: {
        name: NAME,
        owner: { connect: { id: USER.id } },
      } });
      NEXT_DECK = await prisma.deck.create({ data: {
        name: NEXT_NAME,
        owner: { connect: { id: USER.id } },
      } });
      OTHER_DECK = await prisma.deck.create({ data: {
        name: OTHER_NAME,
        owner: { connect: { id: OTHER_USER.id } },
      } });
      CARD = await prisma.card.create({ data: {
        prompt: PROMPT,
        fullAnswer: FULL_ANSWER,
        deck: { connect: { id: DECK.id } },
      } });
      NEXT_CARD = await prisma.card.create({ data: {
        prompt: NEXT_PROMPT,
        fullAnswer: NEXT_FULL_ANSWER,
        deck: { connect: { id: NEXT_DECK.id } },
      } });
      OTHER_CARD = await prisma.card.create({ data: {
        prompt: OTHER_PROMPT,
        fullAnswer: OTHER_FULL_ANSWER,
        deck: { connect: { id: OTHER_DECK.id } },
      } });
    });

    afterEach(async () => {
      await prisma.card.deleteMany({});
      await prisma.deck.deleteMany({});
      await prisma.user.deleteMany({});
    });

    describe("Mutation.cardCreate", () => {
      test("It should create a card in specified current user-owned deck and return it", async () => {
        expect.assertions(6);
        const card = await Mutation.cardCreate({}, {
          deckId: DECK.id,
          card: {
            prompt: NEW_PROMPT,
            fullAnswer: NEW_FULL_ANSWER,
            answers: [],
          },
        }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(card).toHaveProperty("deckId", DECK.id);
        expect(card).toHaveProperty("prompt", NEW_PROMPT);
        expect(card).toHaveProperty("fullAnswer", NEW_FULL_ANSWER);
        if (!card) {
          return;
        }
        const pCard = await prisma.card.findOne({ where: { id: card.id } });
        expect(pCard).toHaveProperty("deckId", DECK.id);
        expect(pCard).toHaveProperty("prompt", NEW_PROMPT);
        expect(pCard).toHaveProperty("fullAnswer", NEW_FULL_ANSWER);
      });

      test("It should do nothing and return null if user does not own specified deck", async () => {
        expect.assertions(2);
        const cardCount = await prisma.card.count({});
        const card = await Mutation.cardCreate({}, {
          deckId: DECK.id,
          card: {
            prompt: NEW_PROMPT,
            fullAnswer: NEW_FULL_ANSWER,
            answers: [],
          },
        }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(card).toBeNull();
        expect(await prisma.card.count({})).toBe(cardCount);
      });

      test("It should do nothing and return null if deck does not exist", async () => {
        expect.assertions(2);
        const cardCount = await prisma.card.count({});
        const card = await Mutation.cardCreate({}, {
          deckId: NIL_ID,
          card: {
            prompt: NEW_PROMPT,
            fullAnswer: NEW_FULL_ANSWER,
            answers: [],
          },
        }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(card).toBeNull();
        expect(await prisma.card.count({})).toBe(cardCount);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(2);
        const cardCount = await prisma.card.count({});
        const card = await Mutation.cardCreate({}, {
          deckId: NIL_ID,
          card: {
            prompt: NEW_PROMPT,
            fullAnswer: NEW_FULL_ANSWER,
            answers: [],
          },
        }, baseCtx, baseInfo);
        expect(card).toBeNull();
        expect(await prisma.card.count({})).toBe(cardCount);
      });
    });

    describe.skip("Mutation.cardEdit", () => {
      // TODO
    });

    describe.skip("Mutation.cardDelete", () => {
      // TODO
    });
  });


  describe("Room fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const THIRD_EMAIL = "jkl@xyz";
    const NEW_EMAIL = "ghi@xyz";
    const NEW_CONTENT = "baz";
    const DECK_NAME = "d1";
    let USER: UserSS;
    let OTHER_USER: UserSS;
    let THIRD_USER: UserSS;
    let DECK: DeckSS;
    let OTHER_DECK: DeckSS;
    let ROOM: RoomSS;
    let OTHER_ROOM: RoomSS;

    beforeEach(async () => {
      USER = userToSS(await prisma.user.create({ data: {
        email: EMAIL,
      } }));
      OTHER_USER = userToSS(await prisma.user.create({ data: {
        email: OTHER_EMAIL,
      } }));
      THIRD_USER = userToSS(await prisma.user.create({ data: {
        email: THIRD_EMAIL,
      } }));
      DECK = await prisma.deck.create({ data: {
        name: DECK_NAME,
        owner: { connect: { id: USER.id } },
      } });
      OTHER_DECK = await prisma.deck.create({ data: {
        name: DECK_NAME,
        owner: { connect: { id: USER.id } },
      } });
      ROOM = roomToSS(await prisma.room.create({ data: {
        owner: { connect: { id: USER.id } },
        occupants: {
          create: [
            { occupant: { connect: { id: USER.id } } },
            { occupant: { connect: { id: OTHER_USER.id } } },
          ],
        },
      } }));
      OTHER_ROOM = roomToSS(await prisma.room.create({ data: {
        owner: { connect: { id: OTHER_USER.id } },
        occupants: {
          create: [{ occupant: { connect: { id: OTHER_USER.id } } }],
        },
      } }));
    });

    afterEach(async () => {
      await prisma.occupant.deleteMany({});
      await prisma.room.deleteMany({});
      await prisma.deck.deleteMany({});
      await prisma.user.deleteMany({});
    });

    describe("Mutation.roomCreate", () => {
      test("It should create a new room owned by current user and return it", async () => {
        expect.assertions(3);
        const roomCount = await prisma.room.count({});
        const config = {
          deckId: DECK.id,
          deckName: DECK.name,
        };
        const room = await Mutation.roomCreate({}, { config }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(room).toHaveProperty("config", config);
        if (!room) {
          return;
        }
        const pRoom = await prisma.room.findOne({ where: { id: room.id } });
        expect(pRoom).toHaveProperty("config", config);
        expect(await prisma.room.count({})).toBe(roomCount + 1);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(2);
        const roomCount = await prisma.room.count({});
        const config = {
          deckId: DECK.id,
          deckName: DECK.name,
        };
        const room = await Mutation.roomCreate({}, { config }, baseCtx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.room.count({})).toBe(roomCount);
      });
    });

    describe("Mutation.roomUpdateConfig", () => {
      test("It should edit a room owned by current user and return it", async () => {
        expect.assertions(4);
        const roomCount = await prisma.room.count({});
        const config = {
          deckId: DECK.id,
          deckName: DECK.name,
        };
        const pRoom1 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom1).not.toHaveProperty("config", config);
        const room = await Mutation.roomUpdateConfig({}, {
          id: ROOM.id,
          config,
        }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(room).toHaveProperty("config", config);
        if (!room) {
          return;
        }
        const pRoom2 = await prisma.room.findOne({ where: { id: room.id } });
        expect(pRoom2).toHaveProperty("config", config);
        expect(await prisma.room.count({})).toBe(roomCount);
      });

      test("It should do nothing and return null if room is not owned by current user", async () => {
        expect.assertions(4);
        const roomCount = await prisma.room.count({});
        const config = {
          deckId: DECK.id,
          deckName: DECK.name,
        };
        const pRoom1 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom1).not.toHaveProperty("config", config);
        const room = await Mutation.roomUpdateConfig({}, {
          id: ROOM.id,
          config,
        }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(room).toBeNull();
        const pRoom2 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom2).not.toHaveProperty("config", config);
        expect(await prisma.room.count({})).toBe(roomCount);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(4);
        const roomCount = await prisma.room.count({});
        const config = {
          deckId: DECK.id,
          deckName: DECK.name,
        };
        const pRoom1 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom1).not.toHaveProperty("config", config);
        const room = await Mutation.roomUpdateConfig({}, {
          id: ROOM.id,
          config,
        }, baseCtx, baseInfo);
        expect(room).toBeNull();
        const pRoom2 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom2).not.toHaveProperty("config", config);
        expect(await prisma.room.count({})).toBe(roomCount);
      });
    });

    describe("Mutation.roomAddOccupant", () => {
      test("It should add the user to the room if current user occupies room, returning the room", async () => {
        expect.assertions(7);
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: THIRD_USER.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: ROOM.id, occupantId: THIRD_USER.id,
        }, ctx, baseInfo);
        expect(room).toHaveProperty("id", ROOM.id);
        if (!room) {
          return;
        }
        const occupants = await Room.occupants(room, {}, ctx, baseInfo);
        expect(occupants).toHaveLength(3);
        expect(occupants).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: THIRD_USER.id,
          }),
        ]));
        if (!occupants) {
          return;
        }
        const occupant = occupants.find((o) => o?.id === THIRD_USER.id);
        if (!occupant) {
          return;
        }
        const occupyingRooms = await User.occupyingRooms(occupant, {}, { ...baseCtx, sub: THIRD_USER }, baseInfo);
        expect(occupyingRooms).toHaveLength(1);
        expect(occupyingRooms).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: ROOM.id,
          }),
        ]));
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: THIRD_USER.id },
        } })).toBe(1);
      });

      test("It should add the user to the room if user is current user, returning the room", async () => {
        expect.assertions(7);
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: THIRD_USER.id },
        } })).toBe(0);
        const ctx = { ...baseCtx, sub: THIRD_USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: ROOM.id, occupantId: THIRD_USER.id,
        }, ctx, baseInfo);
        expect(room).toHaveProperty("id", ROOM.id);
        if (!room) {
          return;
        }
        const occupants = await Room.occupants(room, {}, ctx, baseInfo);
        expect(occupants).toHaveLength(3);
        expect(occupants).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: THIRD_USER.id,
          }),
        ]));
        if (!occupants) {
          return;
        }
        const occupant = occupants.find((o) => o?.id === THIRD_USER.id);
        if (!occupant) {
          return;
        }
        const occupyingRooms = await User.occupyingRooms(occupant, {}, { ...baseCtx, sub: THIRD_USER }, baseInfo);
        expect(occupyingRooms).toHaveLength(1);
        expect(occupyingRooms).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: ROOM.id,
          }),
        ]));
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: THIRD_USER.id },
        } })).toBe(1);
      });

      test("It should do nothing if user already occupies room, current user occupies the room, returning the room", async () => {
        expect.assertions(7);
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: USER.id },
        } })).toBe(1);
        const ctx = { ...baseCtx, sub: OTHER_USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: ROOM.id, occupantId: USER.id,
        }, ctx, baseInfo);
        expect(room).toHaveProperty("id", ROOM.id);
        if (!room) {
          return;
        }
        const occupants = await Room.occupants(room, {}, ctx, baseInfo);
        expect(occupants).toHaveLength(2);
        expect(occupants).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: USER.id,
          }),
        ]));
        if (!occupants) {
          return;
        }
        const occupant = occupants.find((o) => o?.id === USER.id);
        if (!occupant) {
          return;
        }
        const occupyingRooms = await User.occupyingRooms(occupant, {}, { ...baseCtx, sub: USER }, baseInfo);
        expect(occupyingRooms).toHaveLength(1);
        expect(occupyingRooms).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: ROOM.id,
          }),
        ]));
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: USER.id },
        } })).toBe(1);
      });

      test("It should add the user to the room if user is current user occupying the room, returning the room", async () => {
        expect.assertions(7);
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: USER.id },
        } })).toBe(1);
        const ctx = { ...baseCtx, sub: USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: ROOM.id, occupantId: USER.id,
        }, ctx, baseInfo);
        expect(room).toHaveProperty("id", ROOM.id);
        if (!room) {
          return;
        }
        const occupants = await Room.occupants(room, {}, ctx, baseInfo);
        expect(occupants).toHaveLength(2);
        expect(occupants).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: USER.id,
          }),
        ]));
        if (!occupants) {
          return;
        }
        const occupant = occupants.find((o) => o?.id === USER.id);
        if (!occupant) {
          return;
        }
        const occupyingRooms = await User.occupyingRooms(occupant, {}, { ...baseCtx, sub: USER }, baseInfo);
        expect(occupyingRooms).toHaveLength(1);
        expect(occupyingRooms).toEqual(expect.arrayContaining([
          expect.objectContaining({
            id: ROOM.id,
          }),
        ]));
        expect(await prisma.occupant.count({ where: {
          room: { id: ROOM.id },
          occupant: { id: USER.id },
        } })).toBe(1);
      });

      test("It should do nothing if user is neither occupant nor current user, returning null", async () => {
        expect.assertions(2);
        const occupantCount = await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } });
        const ctx = { ...baseCtx, sub: USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: OTHER_ROOM.id, occupantId: THIRD_USER.id,
        }, ctx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } })).toBe(occupantCount);
      });

      test("It should do nothing if user is neither occupant nor current user, returning null, even if person to add is already occupant", async () => {
        expect.assertions(2);
        const occupantCount = await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } });
        const ctx = { ...baseCtx, sub: USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: OTHER_ROOM.id, occupantId: THIRD_USER.id,
        }, ctx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } })).toBe(occupantCount);
      });

      test("It should do nothing if user does not exist, returning null", async () => {
        expect.assertions(2);
        const occupantCount = await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } });
        const ctx = { ...baseCtx, sub: USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: OTHER_ROOM.id, occupantId: NIL_ID,
        }, ctx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } })).toBe(occupantCount);
      });

      test("It should do nothing if room does not exist, returning null", async () => {
        expect.assertions(2);
        const occupantCount = await prisma.occupant.count({ where: {
          occupant: { id: USER.id },
        } });
        const ctx = { ...baseCtx, sub: USER };
        const room = await Mutation.roomAddOccupant({}, {
          id: NIL_ID, occupantId: USER.id,
        }, ctx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.occupant.count({ where: {
          occupant: { id: USER.id },
        } })).toBe(occupantCount);
      });

      test("It should do nothing if not logged in, returning null", async () => {
        expect.assertions(2);
        const occupantCount = await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } });
        const room = await Mutation.roomAddOccupant({}, {
          id: OTHER_ROOM.id, occupantId: THIRD_USER.id,
        }, baseCtx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } })).toBe(occupantCount);
      });

      test("It should do nothing if not logged in, returning null, even if user to add is already occupant", async () => {
        expect.assertions(2);
        const occupantCount = await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } });
        const room = await Mutation.roomAddOccupant({}, {
          id: OTHER_ROOM.id, occupantId: USER.id,
        }, baseCtx, baseInfo);
        expect(room).toBeNull();
        expect(await prisma.occupant.count({ where: {
          room: { id: OTHER_ROOM.id },
        } })).toBe(occupantCount);
      });

    });

    describe("Mutation.roomArchive", () => {
      test("It should edit a room owned by current user and return it", async () => {
        expect.assertions(4);
        const roomCount = await prisma.room.count({});
        const pRoom1 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom1).toHaveProperty("archived", false);
        const room = await Mutation.roomArchive({}, { id: ROOM.id }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(room).toHaveProperty("archived", true);
        const pRoom2 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom2).toHaveProperty("archived", true);
        expect(await prisma.room.count({})).toBe(roomCount);
      });

      test("It should do nothing and return null if room is not owned by current user", async () => {
        expect.assertions(4);
        const roomCount = await prisma.room.count({});
        const pRoom1 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom1).toHaveProperty("archived", false);
        const room = await Mutation.roomArchive({}, { id: ROOM.id }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(room).toBeNull();
        const pRoom2 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom2).toHaveProperty("archived", false);
        expect(await prisma.room.count({})).toBe(roomCount);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(4);
        const roomCount = await prisma.room.count({});
        const pRoom1 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom1).toHaveProperty("archived", false);
        const room = await Mutation.roomArchive({}, {
          id: ROOM.id,
        }, baseCtx, baseInfo);
        expect(room).toBeNull();
        const pRoom2 = await prisma.room.findOne({ where: { id: ROOM.id } });
        expect(pRoom2).toHaveProperty("archived", false);
        expect(await prisma.room.count({})).toBe(roomCount);
      });
    });
  });

  describe("ChatMsg fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const NEW_EMAIL = "ghi@xyz";
    const CONTENT_TYPE = ChatMsgContentType.TEXT;
    const CONTENT = "content";
    const NEXT_CONTENT_TYPE = ChatMsgContentType.CONFIG;
    const NEXT_CONTENT = JSON.stringify({ foo: "bar" });
    const OTHER_CONTENT_TYPE = ChatMsgContentType.TEXT;
    const OTHER_CONTENT = "otherContent";
    const NEW_CONTENT = "newContent";
    let USER: UserSS;
    let OTHER_USER: UserSS;
    let ROOM: RoomSS;
    let NEXT_ROOM: RoomSS;
    let OTHER_ROOM: RoomSS;
    let CHAT_MSG: ChatMsgSS;
    let NEXT_CHAT_MSG: ChatMsgSS;
    let OTHER_CHAT_MSG: ChatMsgSS;

    beforeEach(async () => {
      USER = userToSS(await prisma.user.create({ data: {
        email: EMAIL,
      } }));
      OTHER_USER = userToSS(await prisma.user.create({ data: {
        email: OTHER_EMAIL,
      } }));
      ROOM = roomToSS(await prisma.room.create({ data: {
        owner: { connect: { id: USER.id } },
        occupants: {
          create: [{ occupant: { connect: { id: USER.id } } }],
        },
      } }));
      NEXT_ROOM = roomToSS(await prisma.room.create({ data: {
        owner: { connect: { id: USER.id } },
        occupants: {
          create: [
            {
              occupant: { connect: { id: USER.id } },
            }, {
              occupant: { connect: { id: OTHER_USER.id } },
            },
          ],
        },
      } }));
      OTHER_ROOM = roomToSS(await prisma.room.create({ data: {
        owner: { connect: { id: OTHER_USER.id } },
        occupants: {
          create: [{ occupant: { connect: { id: OTHER_USER.id } } }],
        },
      } }));
      CHAT_MSG = chatMsgToSS(await prisma.chatMsg.create({ data: {
        type: CONTENT_TYPE,
        content: CONTENT,
        room: { connect: { id: ROOM.id } },
      } }));
      NEXT_CHAT_MSG = chatMsgToSS(await prisma.chatMsg.create({ data: {
        type: NEXT_CONTENT_TYPE,
        content: NEXT_CONTENT,
        room: { connect: { id: NEXT_ROOM.id } },
      } }));
      OTHER_CHAT_MSG = chatMsgToSS(await prisma.chatMsg.create({ data: {
        type: OTHER_CONTENT_TYPE,
        content: OTHER_CONTENT,
        room: { connect: { id: OTHER_ROOM.id } },
      } }));
    });

    describe("Mutation.chatMsgCreate", () => {
      test("It should create a chat message with current user as sender when current user is occupant in room.", async () => {
        expect.assertions(4);
        const chatMsg = await Mutation.chatMsgCreate({}, {
          roomId: ROOM.id,
          type: ChatMsgContentType.TEXT,
          content: NEW_CONTENT,
        }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        if (!chatMsg) {
          return;
        }
        expect(chatMsg).toHaveProperty("roomId", ROOM.id);
        expect(chatMsg).toHaveProperty("senderId", USER.id);
        expect(chatMsg).toHaveProperty("content", NEW_CONTENT);
        expect(await prisma.chatMsg.findOne({ where: { id: chatMsg.id } })).toEqual(expect.objectContaining({
          roomId: ROOM.id,
          senderId: USER.id,
          content: NEW_CONTENT,
        }));
      });

      test("It should do nothing and return null if user does not occupy room", async () => {
        expect.assertions(2);
        const chatMsgCount = await prisma.chatMsg.count({});
        const chatMsg = await Mutation.chatMsgCreate({}, {
          roomId: ROOM.id,
          type: ChatMsgContentType.TEXT,
          content: NEW_CONTENT,
        }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(chatMsg).toBeNull();
        expect(await prisma.chatMsg.count({})).toBe(chatMsgCount);
      });

      test("It should do nothing and return null if room does not exist", async () => {
        expect.assertions(2);
        const chatMsgCount = await prisma.chatMsg.count({});
        const chatMsg = await Mutation.chatMsgCreate({}, {
          roomId: NIL_ID,
          type: ChatMsgContentType.TEXT,
          content: NEW_CONTENT,
        }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(chatMsg).toBeNull();
        expect(await prisma.chatMsg.count({})).toBe(chatMsgCount);
      });

      test("It should do nothing and return null if not logged in", async () => {
        expect.assertions(2);
        const chatMsgCount = await prisma.chatMsg.count({});
        const chatMsg = await Mutation.chatMsgCreate({}, {
          roomId: ROOM.id,
          type: ChatMsgContentType.TEXT,
          content: NEW_CONTENT,
        }, baseCtx, baseInfo);
        expect(chatMsg).toBeNull();
        expect(await prisma.chatMsg.count({})).toBe(chatMsgCount);
      });
    });
  });
});
