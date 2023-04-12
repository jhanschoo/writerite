import { IResolverObject } from "apollo-server-koa";

import { FieldResolver, Roles, Update, WrContext } from "../types";

import { DeckSS, ownDecksTopic, userOwnsDeck } from "../model/Deck";
import { CardSS, cardsOfDeckTopic } from "../model/Card";
import { RoomSS, roomTopic, roomsTopic, userOccupiesRoom } from "../model/Room";
import { ChatMsgSS, chatMsgsOfRoomTopic } from "../model/ChatMsg";

interface SubscriptionFieldResolver<TArgs, TYield> {
  subscribe: FieldResolver<
    Record<string, unknown>,
    WrContext,
    TArgs,
    AsyncIterator<TYield> | null
  >;
}

interface SubscriptionResolver
  extends IResolverObject<Record<string, unknown>, WrContext> {
  ownDecksUpdates: SubscriptionFieldResolver<
    Record<string, unknown>,
    Update<DeckSS>
  >;
  cardsOfDeckUpdates: SubscriptionFieldResolver<
    { deckId: string },
    Update<CardSS>
  >;
  // eslint-disable-next-line @typescript-eslint/ban-types
  roomsUpdates: SubscriptionFieldResolver<{}, Update<RoomSS>>;
  roomUpdates: SubscriptionFieldResolver<{ id: string }, Update<RoomSS>>;
  chatMsgsOfRoomUpdates: SubscriptionFieldResolver<
    { roomId: string },
    Update<ChatMsgSS>
  >;
}

const ownDecksUpdates: SubscriptionFieldResolver<
  Record<string, unknown>,
  Update<DeckSS>
> = {
  subscribe(_parent, _args, { sub, pubsub }, _info) {
    if (!sub) {
      return null;
    }
    return pubsub.asyncIterator<Update<DeckSS>>(ownDecksTopic(sub.id));
  },
};

const cardsOfDeckUpdates: SubscriptionFieldResolver<
  { deckId: string },
  Update<CardSS>
> = {
  async subscribe(_parent, { deckId }, { sub, pubsub, prisma }, _info) {
    if (!sub || !(await userOwnsDeck({ prisma, userId: sub.id, deckId }))) {
      return null;
    }
    return pubsub.asyncIterator<Update<CardSS>>(cardsOfDeckTopic(deckId));
  },
};

// eslint-disable-next-line @typescript-eslint/ban-types
const roomsUpdates: SubscriptionFieldResolver<{}, Update<RoomSS>> = {
  subscribe(_parent, _args, { sub, pubsub }, _info) {
    if (!sub?.roles.includes(Roles.wright)) {
      return null;
    }
    return pubsub.asyncIterator<Update<RoomSS>>(roomsTopic);
  },
};

const roomUpdates: SubscriptionFieldResolver<{ id: string }, Update<RoomSS>> = {
  async subscribe(_parent, { id }, { sub, pubsub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    const isWright = sub.roles.includes(Roles.wright);
    if (
      !isWright &&
      !(await userOccupiesRoom({ prisma, occupantId: sub.id, where: { id } }))
    ) {
      return null;
    }
    return pubsub.asyncIterator<Update<RoomSS>>(roomTopic(id));
  },
};

const chatMsgsOfRoomUpdates: SubscriptionFieldResolver<
  { roomId: string },
  Update<ChatMsgSS>
> = {
  async subscribe(_parent, { roomId }, { sub, pubsub, prisma }, _info) {
    if (!sub) {
      return null;
    }
    const isWright = sub.roles.includes(Roles.wright);
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
    return pubsub.asyncIterator<Update<ChatMsgSS>>(chatMsgsOfRoomTopic(roomId));
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Subscription: SubscriptionResolver = {
  ownDecksUpdates,
  cardsOfDeckUpdates,
  roomUpdates,
  roomsUpdates,
  chatMsgsOfRoomUpdates,
};
