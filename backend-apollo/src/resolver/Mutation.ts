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
import { RoomConfigInput, RoomSS, roomToSS, roomTopic, userOccupiesRoom, userOwnsRoom } from "../model/Room";
import { ChatMsgContentType, ChatMsgSS, chatMsgToSS, chatMsgsOfRoomTopic } from "../model/ChatMsg";
import { JsonObject } from "type-fest";

const localAuth = new LocalAuthService();
const googleAuth = new GoogleAuthService();
const facebookAuth = new FacebookAuthService();
const developmentAuth = new DevelopmentAuthService();

interface MutationResolver extends IResolverObject<Record<string, unknown>, WrContext> {
  signin: FieldResolver<Record<string, unknown>, WrContext, {
    email: string;
    name?: string;
    token: string;
    authorizer: string;
    identifier: string;
    persist?: boolean;
  }, AuthResponseSS | null>;
  userEdit: FieldResolver<Record<string, unknown>, WrContext, { name: string }, UserSS | null>;
  deckCreate: FieldResolver<Record<string, unknown>, WrContext, {
    name?: string;
    description?: string;
    promptLang?: string;
    answerLang?: string;
    published?: boolean;
  }, DeckSS | null>;
  deckCreateFromRows: FieldResolver<Record<string, unknown>, WrContext, {
    name?: string;
    description?: string;
    promptLang?: string;
    answerLang?: string;
    published?: boolean;
    rows: string[][];
  }, DeckSS | null>;
  deckEdit: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
    name?: string;
    description?: string;
    promptLang?: string;
    answerLang?: string;
    published?: boolean;
  }, DeckSS | null>;
  deckAddSubdeck: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
    subdeckId: string;
  }, DeckSS | null>;
  deckRemoveSubdeck: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
    subdeckId: string;
  }, DeckSS | null>;
  deckDelete: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
  }, DeckSS | null>;
  cardCreate: FieldResolver<Record<string, unknown>, WrContext, {
    deckId: string;
    prompt: string;
    fullAnswer: string;
    answers?: string[];
    sortKey?: string;
    template?: boolean;
  }, CardSS | null>;
  cardsCreate: FieldResolver<Record<string, unknown>, WrContext, {
    deckId: string;
    prompt: string;
    fullAnswer: string;
    answers?: string[];
    sortKey?: string;
    template?: boolean;
    multiplicity: number;
  }, (CardSS | null)[] | null>;
  cardEdit: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
    prompt?: string;
    fullAnswer?: string;
    answers?: string[];
    sortKey?: string;
    template?: boolean;
  }, CardSS | null>;
  cardDelete: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
  }, CardSS | null>;

  roomCreate: FieldResolver<Record<string, unknown>, WrContext, {
    config: RoomConfigInput & JsonObject;
  }, RoomSS | null>;
  roomUpdateConfig: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
    config: RoomConfigInput & JsonObject;
  }, RoomSS | null>;
  roomAddOccupant: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
    occupantId: string;
  }, RoomSS | null>;
  roomArchive: FieldResolver<Record<string, unknown>, WrContext, {
    id: string;
  }, RoomSS | null>;

  chatMsgCreate: FieldResolver<Record<string, unknown>, WrContext, {
    roomId: string;
    type: ChatMsgContentType;
    content: string;
  }, ChatMsgSS | null>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
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
    try {
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
    } catch (e) {
      return null;
    }
  },
  async userEdit(_parent, { name }, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      return userToSS(await prisma.user.update({
        where: { id: sub.id },
        data: { name },
      }));
    } catch (e) {
      return null;
    }
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
    try {
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
    } catch (e) {
      return null;
    }
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
    try {
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
    } catch (e) {
      return null;
    }
  },
  async deckEdit(_parent, {
    id,
    name,
    description,
    promptLang,
    answerLang,
    published,
  }, { sub, pubsub, prisma }, _info) {
    try {
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
    } catch (e) {
      return null;
    }
  },
  async deckAddSubdeck(_parent, {
    id,
    subdeckId,
  }, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId: id })) {
        return null;
      }
      const deck = await prisma.deck.update({
        where: { id },
        data: {
          subdecks: { upsert: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
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
    } catch (e) {
      return null;
    }
  },
  async deckRemoveSubdeck(_parent, {
    id,
    subdeckId,
  }, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId: id })) {
        return null;
      }
      const deck = await prisma.deck.update({
        where: { id },
        data: {
          subdecks: { deleteMany: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
            A: id, B: subdeckId,
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
    } catch (e) {
      return null;
    }
  },
  async deckDelete(_parent, {
    id,
  }, { sub, pubsub, prisma }, _info) {
    try {
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
    } catch (e) {
      return null;
    }
  },
  async cardCreate(_parent, {
    deckId,
    prompt,
    fullAnswer,
    answers,
    sortKey,
    template,
  }, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId })) {
        return null;
      }
      const card = await prisma.card.create({ data: {
        prompt,
        fullAnswer,
        answers: { set: answers ?? [] },
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
    } catch (e) {
      return null;
    }
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
    try {
      if (!sub || !await userOwnsDeck({ prisma, userId: sub.id, deckId })) {
        return null;
      }
      const cardsPs: Promise<CardSS>[] = [];
      for (let i = 0; i < multiplicity; ++i) {
        cardsPs.push(prisma.card.create({ data: {
          prompt,
          fullAnswer,
          answers: { set: answers ?? [] },
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
    } catch (e) {
      return null;
    }
  },
  async cardEdit(_parent, {
    id,
    prompt,
    fullAnswer,
    answers,
    sortKey,
    template,
  }, { sub, pubsub, prisma }, _info) {
    try {
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
    } catch (e) {
      return null;
    }
  },
  async cardDelete(_parent, {
    id,
  }, { sub, pubsub, prisma }, _info) {
    try {
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
    } catch (e) {
      return null;
    }
  },

  async roomCreate(_parent, {
    config,
  }, { sub, pubsub, prisma }, _info) {
    // TODO: validate config, check if automatically validated
    if (!sub) {
      return null;
    }
    try {
      const room = roomToSS(await prisma.room.create({
        data: {
          owner: { connect: { id: sub.id } },
          config,
          occupants: { create: { occupant: { connect: { id: sub.id } } } },
        },
      }));
      const update: Update<RoomSS> = {
        type: UpdateType.DELETED,
        data: room,
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      pubsub.publish(roomTopic(room.id), update);
      return room;
    } catch (e) {
      return null;
    }
  },
  async roomUpdateConfig(_parent, {
    id,
    config,
  }, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub || !await userOwnsRoom({ prisma, userId: sub.id, roomId: id })) {
        return null;
      }
      const room = roomToSS(await prisma.room.update({
        where: { id },
        data: {
          config,
        },
      }));
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data: room,
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      pubsub.publish(roomTopic(id), update);
      return room;
    } catch (e) {
      return null;
    }
  },
  async roomAddOccupant(_parent, {
    id,
    occupantId,
  }, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub ||
        sub.id !== occupantId &&
        !(await prisma.room.count({ where: {
          id,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          occupants: { some: { B: sub.id } },
        } }) === 1)) {
        return null;
      }
      const room = roomToSS(await prisma.room.update({
        where: { id },
        data: {
          occupants: {
            upsert: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
              where: { A_B: { A: id, B: occupantId } },
              update: {},
              create: { occupant: { connect: { id: occupantId } } },
            },
          },
        },
      }));
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data: room,
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      pubsub.publish(roomTopic(id), update);
      return room;
    } catch (e) {
      return null;
    }
  },
  async roomArchive(_parent, {
    id,
  }, { sub, pubsub, prisma }, _info) {
    try {
      if (!await userOwnsRoom({ prisma, userId: sub?.id, roomId: id })) {
        return null;
      }
      const room = roomToSS(await prisma.room.update({
        where: { id },
        data: {
          archived: true,
        },
      }));
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data: room,
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      pubsub.publish(roomTopic(id), update);
      return room;
    } catch (e) {
      return null;
    }
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
    try {
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
    } catch (e) {
      return null;
    }
  },
};
