import { IResolverObject } from "apollo-server-koa";
import moment from "moment";

import {
  AuthorizerType,
  FieldResolver,
  Roles,
  Update,
  UpdateType,
  WrContext,
} from "../types";

import { LocalAuthService } from "../service/LocalAuthService";
import { GoogleAuthService } from "../service/GoogleAuthService";
import { FacebookAuthService } from "../service/FacebookAuthService";
import { DevelopmentAuthService } from "../service/DevelopmentAuthService";

import {
  InputJsonValue,
  JsonObject,
  Room,
  RoomState,
  Unit,
} from "@prisma/client";
import { AuthResponseSS } from "../model/Authorization";
import { UserSS, userToSS } from "../model/User";
import { DeckSS, ownDecksTopic, userOwnsDeck } from "../model/Deck";
import {
  CardCreateInput,
  CardSS,
  cardsOfDeckTopic,
  userOwnsCard,
} from "../model/Card";
import {
  RoomSS,
  roomToSS,
  roomTopic,
  roomsTopic,
  userOccupiesRoom,
  userOwnsRoom,
} from "../model/Room";
import {
  ChatMsgContentType,
  ChatMsgSS,
  chatMsgToSS,
  chatMsgsOfRoomTopic,
} from "../model/ChatMsg";
import { UserDeckRecordSS } from "../model/UserDeckRecord";
import { UserCardRecordSS } from "../model/UserCardRecord";
import { handleError } from "../util";

const TWO_HOURS_IN_MS = 1000 * 60 * 60 * 2;

const localAuth = new LocalAuthService();
const googleAuth = new GoogleAuthService();
const facebookAuth = new FacebookAuthService();
const developmentAuth = new DevelopmentAuthService();

interface MutationResolver
  extends IResolverObject<Record<string, unknown>, WrContext> {
  signin: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      email: string;
      name?: string;
      token: string;
      authorizer: string;
      identifier: string;
      persist?: boolean;
    },
    AuthResponseSS | null
  >;
  userEdit: FieldResolver<
    Record<string, unknown>,
    WrContext,
    { name: string },
    UserSS | null
  >;
  deckCreate: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      name?: string;
      description?: JsonObject;
      promptLang?: string;
      answerLang?: string;
      published?: boolean;
      archived?: boolean;
      cards?: CardCreateInput[];
    },
    DeckSS | null
  >;
  deckEdit: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      name?: string;
      description?: JsonObject;
      promptLang?: string;
      answerLang?: string;
      published?: boolean;
      archived?: boolean;
    },
    DeckSS | null
  >;
  deckUsed: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
    },
    DeckSS | null
  >;
  deckAddSubdeck: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      subdeckId: string;
    },
    DeckSS | null
  >;
  deckRemoveSubdeck: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      subdeckId: string;
    },
    DeckSS | null
  >;
  deckDelete: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
    },
    DeckSS | null
  >;
  ownDeckRecordSet: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      deckId: string;
      notes: JsonObject;
    },
    UserDeckRecordSS | null
  >;
  cardCreate: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      deckId: string;
      card: CardCreateInput;
      mainTemplate: boolean;
    },
    CardSS | null
  >;
  cardEdit: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      prompt?: JsonObject;
      fullAnswer?: JsonObject;
      answers?: string[];
      sortKey?: string;
      template?: boolean;
      mainTemplate?: boolean;
    },
    CardSS | null
  >;
  cardUnsetMainTemplate: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      deckId: string;
    },
    boolean | null
  >;
  cardDelete: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
    },
    CardSS | null
  >;
  ownCardRecordSet: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      cardId: string;
      correctRecord?: string[];
    },
    UserCardRecordSS | null
  >;
  roomCreate: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      ownerConfig?: JsonObject;
    },
    RoomSS | null
  >;
  roomEditOwnerConfig: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      ownerConfig: JsonObject;
    },
    RoomSS | null
  >;
  roomSetState: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      state: RoomState;
    },
    RoomSS | null
  >;
  // eslint-disable-next-line @typescript-eslint/ban-types
  roomCleanUpDead: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {},
    number | null
  >;
  roomAddOccupant: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      occupantId: string;
    },
    RoomSS | null
  >;
  roomAddOccupantByEmail: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      id: string;
      email: string;
    },
    RoomSS | null
  >;
  chatMsgCreate: FieldResolver<
    Record<string, unknown>,
    WrContext,
    {
      roomId: string;
      type: ChatMsgContentType;
      content: InputJsonValue;
    },
    ChatMsgSS | null
  >;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Mutation: MutationResolver = {
  signin(
    _parent,
    { email, name, token, authorizer, identifier, persist },
    { prisma },
    _info
  ) {
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
      return handleError(e);
    }
  },
  async deckCreate(
    _parent,
    { name, description, promptLang, answerLang, published, archived, cards },
    { sub, pubsub, prisma },
    _info
  ) {
    if (!sub) {
      return null;
    }
    try {
      const cardsCreate = cards && {
        create: cards.map(({ prompt, fullAnswer, answers }) => ({
          prompt,
          fullAnswer,
          answers: { set: answers },
        })),
      };
      const deck = await prisma.deck.create({
        data: {
          name,
          description,
          promptLang,
          answerLang,
          published,
          archived,
          owner: { connect: { id: sub.id } },
          cards: cardsCreate,
        },
      });
      const ownDecksUpdates: Update<DeckSS> = {
        type: UpdateType.CREATED,
        data: deck,
      };
      void pubsub.publish(ownDecksTopic(sub.id), { ownDecksUpdates });
      return deck;
    } catch (e) {
      return handleError(e);
    }
  },
  async deckEdit(
    _parent,
    { id, name, description, promptLang, answerLang, published, archived },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      if (
        !sub ||
        !(await userOwnsDeck({ prisma, userId: sub.id, deckId: id }))
      ) {
        return null;
      }
      const dateNow = new Date();
      const deck = await prisma.deck.update({
        where: { id },
        data: {
          name,
          description,
          promptLang,
          answerLang,
          published,
          archived,
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      const ownDecksUpdates: Update<DeckSS> = {
        type: UpdateType.EDITED,
        data: deck,
      };
      void pubsub.publish(ownDecksTopic(sub.id), { ownDecksUpdates });
      return deck;
    } catch (e) {
      return handleError(e);
    }
  },
  async deckUsed(_parent, { id }, { sub, prisma }, _info) {
    try {
      if (!sub) {
        return null;
      }
      const dateNow = new Date();
      const deck = await prisma.deck.update({
        where: { id },
        data: {
          usedAt: dateNow,
        },
      });
      return deck;
    } catch (e) {
      return handleError(e);
    }
  },
  async deckAddSubdeck(
    _parent,
    { id, subdeckId },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      if (
        !sub ||
        !(await userOwnsDeck({ prisma, userId: sub.id, deckId: id }))
      ) {
        return null;
      }
      const dateNow = new Date();
      const deck = await prisma.deck.update({
        where: { id },
        data: {
          subdecks: {
            upsert: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              where: {
                parentDeckId_subdeckId: { parentDeckId: id, subdeckId },
              },
              update: {},
              create: { subdeck: { connect: { id: subdeckId } } },
            },
          },
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      const ownDecksUpdates: Update<DeckSS> = {
        type: UpdateType.EDITED,
        data: deck,
      };
      void pubsub.publish(ownDecksTopic(sub.id), { ownDecksUpdates });
      return deck;
    } catch (e) {
      return handleError(e);
    }
  },
  async deckRemoveSubdeck(
    _parent,
    { id, subdeckId },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      if (
        !sub ||
        !(await userOwnsDeck({ prisma, userId: sub.id, deckId: id }))
      ) {
        return null;
      }
      const dateNow = new Date();
      const deck = await prisma.deck.update({
        where: { id },
        data: {
          subdecks: {
            deleteMany: {
              parentDeckId: id,
              subdeckId,
            },
          },
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      const ownDecksUpdates: Update<DeckSS> = {
        type: UpdateType.EDITED,
        data: deck,
      };
      void pubsub.publish(ownDecksTopic(sub.id), { ownDecksUpdates });
      return deck;
    } catch (e) {
      return handleError(e);
    }
  },
  async deckDelete(_parent, { id }, { sub, pubsub, prisma }, _info) {
    try {
      if (
        !sub ||
        !(await userOwnsDeck({ prisma, userId: sub.id, deckId: id }))
      ) {
        return null;
      }
      await prisma.userCardRecord.deleteMany({
        where: { card: { deckId: id } },
      });
      await prisma.card.deleteMany({
        where: { deckId: id },
      });
      await prisma.userDeckRecord.deleteMany({
        where: { deckId: id },
      });
      await prisma.subdeck.deleteMany({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        where: { OR: [{ parentDeckId: id }, { subdeckId: id }] },
      });
      const deck = await prisma.deck.delete({ where: { id } });
      const ownDecksUpdates: Update<DeckSS> = {
        type: UpdateType.DELETED,
        data: deck,
      };
      void pubsub.publish(ownDecksTopic(sub.id), { ownDecksUpdates });
      return deck;
    } catch (e) {
      return handleError(e);
    }
  },
  async ownDeckRecordSet(_parent, { deckId, notes }, { sub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    const { id } = sub;
    try {
      return await prisma.userDeckRecord.upsert({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userId_deckId: { userId: sub.id, deckId },
        },
        create: {
          deck: { connect: { id: deckId } },
          user: { connect: { id } },
          notes,
        },
        update: {
          notes,
        },
      });
    } catch (e) {
      return handleError(e);
    }
  },
  async cardCreate(
    _parent,
    {
      deckId,
      card: { prompt, fullAnswer, answers, sortKey, template },
      mainTemplate,
    },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      if (!sub || !(await userOwnsDeck({ prisma, userId: sub.id, deckId }))) {
        return null;
      }
      if (mainTemplate && template === false) {
        return null;
      }
      const dateNow = new Date();
      if (mainTemplate) {
        await prisma.card.updateMany({
          where: {
            default: Unit.UNIT,
            deckId,
          },
          data: { default: null },
        });
      }
      const card = await prisma.card.create({
        data: {
          prompt,
          fullAnswer,
          answers: { set: answers },
          sortKey,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          template: mainTemplate || template,
          deck: { connect: { id: deckId } },
          default: mainTemplate ? Unit.UNIT : null,
          editedAt: dateNow,
        },
      });
      // TODO: put in transaction
      await prisma.deck.update({
        where: { id: deckId },
        data: {
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      const cardsOfDeckUpdates: Update<CardSS> = {
        type: UpdateType.CREATED,
        data: card,
      };
      void pubsub.publish(cardsOfDeckTopic(deckId), { cardsOfDeckUpdates });
      return card;
    } catch (e) {
      return handleError(e);
    }
  },
  async cardEdit(
    _parent,
    { id, prompt, fullAnswer, answers, sortKey, template, mainTemplate },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      if (
        !sub ||
        !(await userOwnsCard({ prisma, userId: sub.id, cardId: id }))
      ) {
        return null;
      }
      if (mainTemplate && template === false) {
        return null;
      }
      const dateNow = new Date();
      if (mainTemplate) {
        await prisma.card.updateMany({
          where: {
            default: Unit.UNIT,
            deck: { cards: { some: { id } } },
          },
          data: { default: null },
        });
      }
      const card = await prisma.card.update({
        where: { id },
        data: {
          prompt,
          fullAnswer,
          answers: answers && { set: answers },
          sortKey,
          template: mainTemplate ? true : template,
          default: mainTemplate
            ? Unit.UNIT
            : mainTemplate === false
            ? null
            : undefined,
          editedAt: dateNow,
        },
      });
      // TODO: put in transaction
      await prisma.deck.update({
        where: { id: card.deckId },
        data: {
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      const cardsOfDeckUpdates: Update<CardSS> = {
        type: UpdateType.EDITED,
        data: card,
      };
      void pubsub.publish(cardsOfDeckTopic(card.deckId), {
        cardsOfDeckUpdates,
      });
      return card;
    } catch (e) {
      return handleError(e);
    }
  },
  async cardUnsetMainTemplate(_parent, { deckId }, { sub, prisma }, _info) {
    try {
      if (!sub || !(await userOwnsDeck({ prisma, deckId, userId: sub.id }))) {
        return null;
      }
      const dateNow = new Date();
      const { count } = await prisma.card.updateMany({
        where: {
          default: Unit.UNIT,
          deckId,
        },
        data: { default: null },
      });
      if (count === 0) {
        return false;
      }
      await prisma.deck.update({
        where: { id: deckId },
        data: {
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      return true;
    } catch (e) {
      return handleError(e);
    }
  },
  async cardDelete(_parent, { id }, { sub, pubsub, prisma }, _info) {
    try {
      if (
        !sub ||
        !(await userOwnsCard({ prisma, userId: sub.id, cardId: id }))
      ) {
        return null;
      }
      const dateNow = new Date();
      await prisma.userCardRecord.deleteMany({
        where: { cardId: id },
      });
      const card = await prisma.card.delete({
        where: { id },
      });
      // TODO: put in transaction
      await prisma.deck.update({
        where: { id: card.deckId },
        data: {
          editedAt: dateNow,
          usedAt: dateNow,
        },
      });
      const cardsOfDeckUpdates: Update<CardSS> = {
        type: UpdateType.DELETED,
        data: card,
      };
      void pubsub.publish(cardsOfDeckTopic(card.deckId), {
        cardsOfDeckUpdates,
      });
      return card;
    } catch (e) {
      return handleError(e);
    }
  },
  async ownCardRecordSet(
    _parent,
    { cardId, correctRecord },
    { sub, prisma },
    _info
  ) {
    if (!sub) {
      return null;
    }
    const { id } = sub;
    const correctRecordArr =
      correctRecord?.map((datetimeStr) => moment.utc(datetimeStr).toDate()) ??
      [];
    try {
      return await prisma.userCardRecord.upsert({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userId_cardId: { userId: sub.id, cardId },
        },
        create: {
          card: { connect: { id: cardId } },
          user: { connect: { id } },
          correctRecord: { set: correctRecordArr },
        },
        update: {
          correctRecord: { set: correctRecordArr },
        },
      });
    } catch (e) {
      return handleError(e);
    }
  },

  async roomCreate(_parent, { ownerConfig }, { sub, pubsub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    try {
      const room = roomToSS(
        await prisma.room.create({
          data: {
            owner: { connect: { id: sub.id } },
            ownerConfig,
            occupants: { create: { occupant: { connect: { id: sub.id } } } },
          },
        })
      );
      const update: Update<RoomSS> = {
        type: UpdateType.DELETED,
        data: room,
      };
      void pubsub.publish(roomsTopic, { roomsUpdates: update });
      void pubsub.publish(roomTopic(room.id), { roomUpdates: update });
      return room;
    } catch (e) {
      return handleError(e);
    }
  },
  async roomEditOwnerConfig(
    _parent,
    { id, ownerConfig },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      if (
        !sub ||
        !(await userOwnsRoom({
          prisma,
          where: { ownerId: sub.id, id, state: RoomState.WAITING },
        }))
      ) {
        return null;
      }
      const room = roomToSS(
        await prisma.room.update({
          where: { id },
          data: {
            ownerConfig,
          },
        })
      );
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data: room,
      };
      void pubsub.publish(roomsTopic, { roomsUpdates: update });
      void pubsub.publish(roomTopic(id), { roomUpdates: update });
      return room;
    } catch (e) {
      return handleError(e);
    }
  },
  async roomSetState(_parent, { id, state }, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub?.roles.includes(Roles.wright)) {
        return null;
      }
      let room: Room | null;
      switch (state) {
        case RoomState.SERVING:
          await prisma.room.updateMany({
            where: { id, state: RoomState.WAITING },
            data: { state: RoomState.SERVING },
          });
          room = await prisma.room.findOne({
            where: { id },
          });
          if (room?.state !== RoomState.SERVING) {
            return null;
          }
          break;
        case RoomState.SERVED:
          await prisma.room.updateMany({
            where: { id, state: RoomState.SERVING },
            data: { state: RoomState.SERVED },
          });
          room = await prisma.room.findOne({
            where: { id },
          });
          if (room?.state !== RoomState.SERVED) {
            return null;
          }
          break;
        default:
          room = null;
      }
      if (!room) {
        return null;
      }
      const data = roomToSS(room);
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data,
      };
      void pubsub.publish(roomsTopic, { roomsUpdates: update });
      void pubsub.publish(roomTopic(id), { roomUpdates: update });
      return data;
    } catch (e) {
      return handleError(e);
    }
  },
  async roomCleanUpDead(_parent, _args, { sub, pubsub, prisma }, _info) {
    try {
      if (!sub?.roles.includes(Roles.wright)) {
        return null;
      }
      const twoHoursAgo = new Date(Date.now() - TWO_HOURS_IN_MS);
      const rooms = await prisma.room.findMany({
        where: {
          state: RoomState.SERVING,
          updatedAt: { gt: twoHoursAgo },
        },
      });

      const { count } = await prisma.room.updateMany({
        where: {
          state: RoomState.SERVING,
          updatedAt: { gt: twoHoursAgo },
        },
        data: { state: RoomState.SERVED },
      });

      /*
       * All rooms in `rooms` are now updated.
       * Because it's not a transaction, we may undercount
       * for sending of subscription updates.
       */
      // TODO: put in transaction
      rooms.forEach((room) => {
        const data = roomToSS(room);
        const { id } = room;
        const update: Update<RoomSS> = {
          type: UpdateType.EDITED,
          data,
        };
        void pubsub.publish(roomsTopic, { roomsUpdates: update });
        void pubsub.publish(roomTopic(id), { roomUpdates: update });
      });
      return count;
    } catch (e) {
      return handleError(e);
    }
  },
  async roomAddOccupant(
    _parent,
    { id, occupantId },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      /*
       * TODO: make room configurable to allow only owner to add people
       * TODO: make room configurable to prevent adding self to a room
       * TODO: implement an invite system
       */
      if (
        !sub ||
        (sub.id !== occupantId &&
          !(await userOccupiesRoom({
            prisma,
            occupantId: sub.id,
            where: { id },
          })))
      ) {
        return null;
      }
      const room = roomToSS(
        await prisma.room.update({
          where: { id },
          data: {
            occupants: {
              upsert: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                where: { roomId_occupantId: { roomId: id, occupantId } },
                update: {},
                create: { occupant: { connect: { id: occupantId } } },
              },
            },
          },
        })
      );
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data: room,
      };
      void pubsub.publish(roomsTopic, { roomUpdates: update });
      void pubsub.publish(roomTopic(id), { roomsUpdates: update });
      return room;
    } catch (e) {
      return handleError(e);
    }
  },
  /*
   * Limitation: this is suspected to fail with null when occupant to
   * add is already in the room.
   */
  async roomAddOccupantByEmail(
    _parent,
    { id, email },
    { sub, pubsub, prisma },
    _info
  ) {
    try {
      /*
       * TODO: make room configurable to allow only owner to add people
       * TODO: make room configurable to prevent adding self to a room
       * TODO: implement an invite system
       */
      if (
        !sub ||
        (sub.email !== email &&
          !(await userOccupiesRoom({
            prisma,
            occupantId: sub.id,
            where: { id },
          })))
      ) {
        return null;
      }
      const room = roomToSS(
        await prisma.room.update({
          where: { id },
          data: {
            occupants: {
              create: {
                occupant: {
                  connect: { email },
                },
              },
            },
          },
        })
      );
      const update: Update<RoomSS> = {
        type: UpdateType.EDITED,
        data: room,
      };
      void pubsub.publish(roomsTopic, { roomUpdates: update });
      void pubsub.publish(roomTopic(id), { roomsUpdates: update });
      return room;
    } catch (e) {
      return handleError(e);
    }
  },
  async chatMsgCreate(
    _parent,
    { roomId, type, content },
    { sub, pubsub, prisma },
    _info
  ) {
    if (!sub) {
      return null;
    }
    const isWright = sub.roles.includes(Roles.wright);
    try {
      if (
        !isWright &&
        !(await userOccupiesRoom({
          prisma,
          occupantId: sub.id,
          where: { id: roomId },
        }))
      ) {
        return null;
      }
      const chatMsg = chatMsgToSS(
        await prisma.chatMsg.create({
          include: {
            sender: true,
          },
          data: {
            room: { connect: { id: roomId } },
            type,
            content,
            sender: isWright ? undefined : { connect: { id: sub.id } },
          },
        })
      );
      const chatMsgsOfRoomUpdates: Update<ChatMsgSS> = {
        type: UpdateType.CREATED,
        data: chatMsg,
      };
      void pubsub.publish(chatMsgsOfRoomTopic(roomId), {
        chatMsgsOfRoomUpdates,
      });
      return chatMsg;
    } catch (e) {
      return handleError(e);
    }
  },
};
