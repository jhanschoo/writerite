import { IResolverObject } from "apollo-server-koa";

import { AuthorizerType, FieldResolver, Roles, Update, UpdateType, WrContext } from "../types";

import { LocalAuthService } from "../service/LocalAuthService";
import { GoogleAuthService } from "../service/GoogleAuthService";
import { FacebookAuthService } from "../service/FacebookAuthService";
import { DevelopmentAuthService } from "../service/DevelopmentAuthService";

import { AuthResponseSS } from "../model/Authorization";
import { UserSS, userToSS } from "../model/User";
import { DeckSS, ownDecksTopic, userOwnsDeck } from "../model/Deck";
import { CardSS, cardsOfDeckTopic, userOwnsCard } from "../model/Card";
import { RoomConfigInput, RoomSS, roomTopic, userOccupiesRoom, userOwnsRoom } from "../model/Room";
import { ChatMsgContentType, ChatMsgSS, chatMsgToSS, chatMsgsOfRoomTopic } from "../model/ChatMsg";

const localAuth = new LocalAuthService();
const googleAuth = new GoogleAuthService();
const facebookAuth = new FacebookAuthService();
const developmentAuth = new DevelopmentAuthService();

interface MutationResolver extends IResolverObject<object, WrContext> {
  signin: FieldResolver<object, WrContext, {
    email: string;
    name?: string | null;
    token: string;
    authorizer: string;
    identifier: string;
    persist?: boolean | null;
  }, AuthResponseSS | null>;
  userEdit: FieldResolver<object, WrContext, { name: string }, UserSS | null>;
  deckCreate: FieldResolver<object, WrContext, {
    name?: string | null;
    description?: string | null;
    promptLang?: string | null;
    answerLang?: string | null;
    published?: boolean | null;
  }, DeckSS | null>;
  deckCreateFromRows: FieldResolver<object, WrContext, {
    name?: string | null;
    description?: string | null;
    promptLang?: string | null;
    answerLang?: string | null;
    published?: boolean | null;
    rows: string[][];
  }, DeckSS | null>;
  deckEdit: FieldResolver<object, WrContext, {
    id: string;
    name?: string | null;
    description?: string | null;
    promptLang?: string | null;
    answerLang?: string | null;
    published?: boolean | null;
  }, DeckSS | null>;
  deckAddSubdeck: FieldResolver<object, WrContext, {
    id: string;
    subdeckId: string;
  }, DeckSS | null>;
  deckRemoveSubdeck: FieldResolver<object, WrContext, {
    id: string;
    subdeckId: string;
  }, DeckSS | null>;
  deckDelete: FieldResolver<object, WrContext, {
    id: string;
  }, DeckSS | null>;
  cardCreate: FieldResolver<object, WrContext, {
    deckId: string;
    prompt: string;
    fullAnswer: string;
    answers?: string[] | null;
    sortKey?: string | null;
    template?: boolean | null;
  }, CardSS | null>;
  cardsCreate: FieldResolver<object, WrContext, {
    deckId: string;
    prompt: string;
    fullAnswer: string;
    answers?: string[] | null;
    sortKey?: string | null;
    template?: boolean | null;
    multiplicity: number;
  }, (CardSS | null)[] | null>;
  cardEdit: FieldResolver<object, WrContext, {
    id: string;
    prompt?: string | null;
    fullAnswer?: string | null;
    answers?: string[] | null;
    sortKey?: string | null;
    template?: boolean | null;
  }, CardSS | null>;
  cardDelete: FieldResolver<object, WrContext, {
    id: string;
  }, CardSS | null>;

  roomCreate: FieldResolver<object, WrContext, {
    config: RoomConfigInput;
  }, RoomSS | null>;
  roomUpdateConfig: FieldResolver<object, WrContext, {
    id: string;
    config: RoomConfigInput;
  }, RoomSS | null>;
  roomAddOccupant: FieldResolver<object, WrContext, {
    id: string;
    occupantId: string;
  }, RoomSS | null>;
  roomArchive: FieldResolver<object, WrContext, {
    id: string;
  }, RoomSS | null>;

  chatMsgCreate: FieldResolver<object, WrContext, {
    roomId: string;
    type: ChatMsgContentType;
    content: string;
  }, ChatMsgSS | null>;
}

export const Mutation: MutationResolver = {
  signin(_parent, {
    email,
    name,
    token,
    authorizer,
    identifier,
    persist,
  }, { prisma }, _info) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unnecessary-condition
    const normalizedName = name || undefined;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unnecessary-condition
    const normalizedPersist = persist || undefined;
    const opts = {
      prisma,
      email,
      name: normalizedName,
      token,
      authorizer,
      identifier,
      persist: normalizedPersist,
    };
    switch (authorizer) {
      case AuthorizerType.GOOGLE:
        return googleAuth.signin(opts);
      case AuthorizerType.FACEBOOK:
        return facebookAuth.signin(opts);
      case AuthorizerType.LOCAL:
        return localAuth.signin(opts);
      case AuthorizerType.DEVELOPMENT:
        return developmentAuth.signin(opts);
      default:
        return null;
    }
  },
  async userEdit(_parent, { name }, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    return userToSS(await prisma.user.update({
      where: { id: sub.id },
      data: { name },
    }));
  },
  async deckCreate(_parent, {
    name,
    description,
    promptLang,
    answerLang,
    published,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    const deck = await prisma.deck.create({
      data: {
        name,
        description,
        promptLang,
        answerLang,
        published,
        owner: { connect: { id: sub.id } },
      },
    });
    const update: Update<DeckSS> = {
      type: UpdateType.CREATED,
      data: deck,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return deck;
  },
  async deckCreateFromRows(_parent, {
    name,
    description,
    promptLang,
    answerLang,
    published,
    rows,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    const deck = await prisma.deck.create({
      data: {
        name,
        description,
        promptLang,
        answerLang,
        published,
        owner: { connect: { id: sub.id } },
        cards: {
          create: rows.map((row) => ({
            prompt: row[0],
            fullAnswer: row[1],
            answers: { set: row.slice(2) },
          })),
        },
      },
    });
    const update: Update<DeckSS> = {
      type: UpdateType.CREATED,
      data: deck,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return deck;
  },
  async deckEdit(_parent, {
    id,
    name,
    description,
    promptLang,
    answerLang,
    published,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId: id })) {
      return null;
    }
    const deck = await prisma.deck.update({
      where: { id },
      data: {
        name,
        description,
        promptLang,
        answerLang,
        published,
      },
    });
    const update: Update<DeckSS> = {
      type: UpdateType.EDITED,
      data: deck,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return deck;
  },
  async deckAddSubdeck(_parent, {
    id,
    subdeckId,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId: id })) {
      return null;
    }
    const deck = await prisma.deck.update({
      where: { id },
      data: {
        subdecks: { upsert: {
          where: { A_B: { A: id, B: subdeckId } },
          update: {},
          create: { subdeck: { connect: { id: subdeckId } } },
        } },
      },
    });
    const update: Update<DeckSS> = {
      type: UpdateType.EDITED,
      data: deck,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return deck;
  },
  async deckRemoveSubdeck(_parent, {
    id,
    subdeckId,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId: id })) {
      return null;
    }
    const deck = await prisma.deck.update({
      where: { id },
      data: {
        subdecks: { delete: {
          A_B: { A: id, B: subdeckId },
        } },
      },
    });
    const update: Update<DeckSS> = {
      type: UpdateType.EDITED,
      data: deck,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return deck;
  },
  async deckDelete(_parent, {
    id,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId: id })) {
      return null;
    }
    const deck = await prisma.deck.delete({ where: { id } });
    const update: Update<DeckSS> = {
      type: UpdateType.DELETED,
      data: deck,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return deck;
  },
  async cardCreate(_parent, {
    deckId,
    prompt,
    fullAnswer,
    answers,
    sortKey,
    template,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId })) {
      return null;
    }
    const card = await prisma.card.create({ data: {
      prompt,
      fullAnswer,
      answers: { set: answers },
      sortKey,
      template,
      deck: { connect: { id: deckId } },
    } });
    const update: Update<CardSS> = {
      type: UpdateType.CREATED,
      data: card,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return card;
  },
  async cardsCreate(_parent, {
    deckId,
    prompt,
    fullAnswer,
    answers,
    sortKey,
    template,
    multiplicity,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId })) {
      return null;
    }
    const cardsPs: Promise<CardSS>[] = [];
    for (let i = 0; i < multiplicity; ++i) {
      cardsPs.push(prisma.card.create({ data: {
        prompt,
        fullAnswer,
        answers: { set: answers },
        sortKey,
        template,
        deck: { connect: { id: deckId } },
      } }));
    }
    const cards = await Promise.all(cardsPs);
    const updates: Update<CardSS>[] = cards.map((card) => ({
      type: UpdateType.CREATED,
      data: card,
    }));
    updates.forEach((update) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      pubsub.publish(cardsOfDeckTopic(sub.id, deckId), update);
    });
    return cards;
  },
  async cardEdit(_parent, {
    id,
    prompt,
    fullAnswer,
    answers,
    sortKey,
    template,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsCard({ prisma, userId: sub.id, cardId: id })) {
      return null;
    }
    const card = await prisma.card.update({
      where: { id },
      data: {
        prompt,
        fullAnswer,
        answers: { set: answers },
        sortKey,
        template,
      },
    });
    const update: Update<CardSS> = {
      type: UpdateType.EDITED,
      data: card,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return card;
  },
  async cardDelete(_parent, {
    id,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsCard({ prisma, userId: sub.id, cardId: id })) {
      return null;
    }
    const card = await prisma.card.delete({
      where: { id },
    });
    const update: Update<CardSS> = {
      type: UpdateType.DELETED,
      data: card,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(ownDecksTopic(sub.id), update);
    return card;
  },

  async roomCreate(_parent, {
    config,
  }, { sub, pubsub, prisma }, _info) {
    // TODO: validate config, check if automatically validated
    if (!sub) {
      return null;
    }
    const room = await prisma.room.create({
      data: {
        owner: { connect: { id: sub.id } },
        config,
        occupants: { create: { occupant: { connect: { id: sub.id } } } },
      },
    });
    const update: Update<RoomSS> = {
      type: UpdateType.DELETED,
      data: room,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(roomTopic(room.id), update);
    return room;
  },
  async roomUpdateConfig(_parent, {
    id,
    config,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub || !await userOwnsRoom({ prisma, userId: sub.id, roomId: id })) {
      return null;
    }
    const room = await prisma.room.update({
      where: { id },
      data: {
        config,
      },
    });
    const update: Update<RoomSS> = {
      type: UpdateType.EDITED,
      data: room,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(roomTopic(id), update);
    return room;
  },
  async roomAddOccupant(_parent, {
    id,
    occupantId,
  }, { pubsub, prisma }, _info) {
    const room = await prisma.room.update({
      where: { id },
      data: {
        occupants: {
          upsert: {
            where: { A_B: { A: id, B: occupantId } },
            update: {},
            create: { occupant: { connect: { id: occupantId } } },
          },
        },
      },
    });
    const update: Update<RoomSS> = {
      type: UpdateType.EDITED,
      data: room,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(roomTopic(id), update);
    return room;
  },
  async roomArchive(_parent, {
    id,
  }, { sub, pubsub, prisma }, _info) {
    if (!await userOwnsRoom({ prisma, userId: sub?.id, roomId: id })) {
      return null;
    }
    const room = await prisma.room.update({
      where: { id },
      data: {
        archived: true,
      },
    });
    const update: Update<RoomSS> = {
      type: UpdateType.EDITED,
      data: room,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(roomTopic(id), update);
    return room;
  },

  async chatMsgCreate(_parent, {
    roomId,
    type,
    content,
  }, { sub, pubsub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    const isWright = sub.roles.includes(Roles.wright);
    if (!isWright && !await userOccupiesRoom({ prisma, userId: sub.id, roomId })) {
      return null;
    }
    const chatMsg = chatMsgToSS(await prisma.chatMsg.create({
      data: {
        room: { connect: { id: roomId } },
        type,
        content,
        sender: isWright ? null : { connect: { id: sub.id } },
      },
    }));
    const update: Update<ChatMsgSS> = {
      type: UpdateType.CREATED,
      data: chatMsg,
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    pubsub.publish(chatMsgsOfRoomTopic(roomId), update);
    return chatMsg;
  },
};
