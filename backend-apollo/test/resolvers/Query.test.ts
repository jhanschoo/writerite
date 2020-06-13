import { PrismaClient } from "@prisma/client";
import type { GraphQLResolveInfo } from "graphql";
import type { MergeInfo } from "apollo-server-koa";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { Redis as RedisClient } from "ioredis";

import type { WrContext } from "../../src/types";
import { Query } from "../../src/resolver/Query";
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

beforeAll(() => {
  prisma = new PrismaClient();
  redisClient = new Redis();
  pubsub = new RedisPubSub();
  baseCtx = { prisma, fetchDepth: 3, pubsub, redisClient };
  baseInfo = {} as GraphQLResolveInfo & { mergeInfo: MergeInfo };
});

afterAll(async () => {
  pubsub.close();
  await redisClient.quit();
  await prisma.disconnect();
});

beforeEach(async () => {
  await prisma.subdeck.deleteMany({});
  await prisma.occupant.deleteMany({});
  await prisma.chatMsg.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.deck.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("Query resolvers", () => {

  describe("User fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const NEW_EMAIL = "ghi@xyz";
    let USER: UserSS;
    let OTHER_USER: UserSS;

    beforeEach(async () => {
      USER = userToSS(await prisma.user.create({ data: { email: EMAIL } }));
      OTHER_USER = userToSS(await prisma.user.create({ data: { email: OTHER_EMAIL } }));
    });

    afterEach(async () => {
      await prisma.user.deleteMany({});
    });

    describe("Query.user", () => {
      test("it should return null on no user present", async () => {
        expect.assertions(1);
        const user = await Query.user({}, { id: "1234567" }, baseCtx, baseInfo);
        expect(user).toBeNull();
      });

      test("it should return user if it exists", async () => {
        expect.assertions(1);
        const user = await Query.user({}, { id: USER.id }, baseCtx, baseInfo);
        if (!user) {
          throw new Error("`user` could not be retrieved");
        }
        expect(user.id).toBe(USER.id);
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
      await prisma.deck.deleteMany({});
      await prisma.user.deleteMany({});
    });

    describe("Query.deck", () => {

      test("it should return null on no deck present", async () => {
        expect.assertions(1);
        expect(await Query.deck({}, { id: "1234567" }, baseCtx, baseInfo)).toBeNull();
      });

      test("it should return a deck if it exists", async () => {
        expect.assertions(1);
        const deck = await Query.deck({}, { id: DECK.id }, baseCtx, baseInfo);
        expect(deck?.id).toBe(DECK.id);
      });
    });

    describe("Query.ownDecks", () => {

      test("it should return user's decks if they exist", async () => {
        expect.assertions(2);
        const decks = await Query.ownDecks({}, {}, {
          ...baseCtx, sub: USER,
        }, baseInfo);
        expect(decks).toHaveLength(1);
        expect(decks).toContainEqual(expect.objectContaining({
          id: DECK.id,
        }));
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
    const NEXT_PROMPT = "prompt";
    const NEXT_FULL_ANSWER = "fullAnswer";
    const OTHER_PROMPT = "otherPrompt";
    const OTHER_FULL_ANSWER = "otherFullAnswer";
    const NEW_PROMPT = "newPrompt";
    const NEW_FULL_ANSWER = "newFullAnswer";
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

    describe("Query.card", () => {
      test("it should return cards having specified id if deck exists", async () => {
        expect.assertions(2);
        const card = await Query.card({}, { id: CARD.id }, baseCtx, baseInfo);
        expect(card).toHaveProperty("prompt", PROMPT);
        expect(card).toHaveProperty("fullAnswer", FULL_ANSWER);
      });
      test("it should return null if no card with said id exists", async () => {
        expect.assertions(1);
        const cards = await Query.card({}, { id: "1234567" }, baseCtx, baseInfo);
        expect(cards).toBeNull();
      });
    });

    describe("Query.cardsOfDeck", () => {
      test("it should return cards from deck containing specified id if deck exists", async () => {
        expect.assertions(2);
        const cards = await Query.cardsOfDeck({}, { deckId: DECK.id }, baseCtx, baseInfo,);
        expect(cards).toHaveLength(1);
        expect(cards).toContainEqual(expect.objectContaining({ prompt: PROMPT, fullAnswer: FULL_ANSWER }),);
      });
      test("it should return null if no deck with said id exists", async () => {
        expect.assertions(1);
        const cards = await Query.cardsOfDeck({}, { deckId: "1234567" }, baseCtx, baseInfo);
        expect(cards).toBeNull();
      });
    });
  });


  describe("Room fields", () => {
    const EMAIL = "abc@xyz";
    const OTHER_EMAIL = "def@xyz";
    const NEW_EMAIL = "ghi@xyz";
    const NEW_CONTENT = "baz";
    const DECK_NAME = "d1";
    let USER: UserSS;
    let OTHER_USER: UserSS;
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
          create: [{ occupant: { connect: { id: USER.id } } }],
        },
      } }));
      OTHER_ROOM = roomToSS(await prisma.room.create({ data: {
        owner: { connect: { id: OTHER_USER.id } },
      } }));
    });

    afterEach(async () => {
      await prisma.occupant.deleteMany({});
      await prisma.room.deleteMany({});
      await prisma.deck.deleteMany({});
      await prisma.user.deleteMany({});
    });

    describe("Query.room", () => {

      test("it should return null on no room present", async () => {
        expect.assertions(1);
        const room = await Query.room({}, { id: "1234567" }, baseCtx, baseInfo);
        expect(room).toBeNull();
      });

      test("it should return room if it exists", async () => {
        expect.assertions(1);
        const room = await Query.room({}, { id: ROOM.id }, baseCtx, baseInfo);
        expect(room?.id).toBe(ROOM.id);
      });
    });

    describe("Query.occupiedRooms", () => {
      test("it should return rooms one is occupying", async () => {
        const rooms = await Query.occupiedRooms({}, {}, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(rooms).toHaveLength(1);
        expect(rooms).toContainEqual(expect.objectContaining({
          id: ROOM.id,
        }));
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

    describe("Query.chatMsg", () => {
      test("it should return chat messages having specified id if user owns or occupies room it is in", async () => {
        expect.assertions(2);
        const chatMsg = await Query.chatMsg({}, { id: CHAT_MSG.id }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(chatMsg).toHaveProperty("content", CONTENT);
        expect(chatMsg).toHaveProperty("type", CONTENT_TYPE);
      });
      test("it should return chat messages having specified id if user occupies room it is in", async () => {
        expect.assertions(2);
        const chatMsg = await Query.chatMsg({}, { id: NEXT_CHAT_MSG.id }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(chatMsg).toHaveProperty("content", NEXT_CONTENT);
        expect(chatMsg).toHaveProperty("type", NEXT_CONTENT_TYPE);
      });
      test("it should return null if no chat message with said id exists", async () => {
        expect.assertions(1);
        const chatMsg = await Query.chatMsg({}, { id: "1234567" }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(chatMsg).toBeNull();
      });
      test("it should return null if user is not occupant of room it is in", async () => {
        expect.assertions(1);
        const chatMsg = await Query.chatMsg({}, { id: CHAT_MSG.id }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(chatMsg).toBeNull();
      });
      test("it should return null if user is not logged in", async () => {
        expect.assertions(1);
        const chatMsg = await Query.chatMsg({}, { id: CHAT_MSG.id }, baseCtx, baseInfo);
        expect(chatMsg).toBeNull();
      });
    });

    describe("Query.chatMsgsOfRoom", () => {
      test("it should return chat messages having specified id if user owns or occupies room it is in", async () => {
        expect.assertions(2);
        const chatMsgs = await Query.chatMsgsOfRoom({}, { roomId: ROOM.id }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(chatMsgs).toHaveLength(1);
        expect(chatMsgs).toContainEqual(expect.objectContaining({
          id: CHAT_MSG.id,
        }));
      });
      test("it should return chat messages having specified id if user occupies room it is in", async () => {
        expect.assertions(2);
        const chatMsgs = await Query.chatMsgsOfRoom({}, { roomId: NEXT_ROOM.id }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(chatMsgs).toHaveLength(1);
        expect(chatMsgs).toContainEqual(expect.objectContaining({
          id: NEXT_CHAT_MSG.id,
        }));
      });
      test("it should return null if no room with said id exists", async () => {
        expect.assertions(1);
        const chatMsgs = await Query.chatMsgsOfRoom({}, { roomId: "1234567" }, {
          ...baseCtx,
          sub: USER,
        }, baseInfo);
        expect(chatMsgs).toBeNull();
      });
      test("it should return null if user is not occupant of room it is in", async () => {
        expect.assertions(1);
        const chatMsgs = await Query.chatMsgsOfRoom({}, { roomId: ROOM.id }, {
          ...baseCtx,
          sub: OTHER_USER,
        }, baseInfo);
        expect(chatMsgs).toBeNull();
      });
      test("it should return null if user is not logged in", async () => {
        expect.assertions(1);
        const chatMsgs = await Query.chatMsgsOfRoom({}, { roomId: ROOM.id }, baseCtx, baseInfo);
        expect(chatMsgs).toBeNull();
      });
    });
  });
});
