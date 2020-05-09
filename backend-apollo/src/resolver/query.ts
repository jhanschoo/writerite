import { IFieldResolver, IResolverObject } from "apollo-server-koa";
import { WrContext } from "../types";
import { WrUser } from "../datasource/WrUser";
import { WrDeck } from "../datasource/WrDeck";
import { WrCard } from "../datasource/WrCard";
import { WrRoom } from "../datasource/WrRoom";
import { WrChatMsg } from "../datasource/WrChatMsg";

interface WrQuery extends IResolverObject<unknown, WrContext> {
  wrUser: IFieldResolver<unknown, WrContext, { id: string }>;
  wrDeck: IFieldResolver<unknown, WrContext, { id: string }>;
  wrOwnDecks: IFieldResolver<unknown, WrContext, object>;
  wrCard: IFieldResolver<unknown, WrContext, { id: string }>;
  wrCardsOfDeck: IFieldResolver<unknown, WrContext, { deckId: string }>;
  wrRoom: IFieldResolver<unknown, WrContext, { id: string }>;
  wrInRooms: IFieldResolver<unknown, WrContext>;
  wrChatMsg: IFieldResolver<unknown, WrContext, { id: string }>;
  wrChatMsgsOfRoom: IFieldResolver<unknown, WrContext, { roomId: string }>;
}

export const Query: WrQuery = {
  wrUser(_parent, { id }, { dataSources: { wrDS } }, _info): Promise<WrUser | null> {
    return wrDS.getWrUser(id);
  },
  wrDeck(_parent, { id }, { dataSources: { wrDS } }, _info): Promise<WrDeck | null> {
    return wrDS.getWrDeck(id);
  },
  wrOwnDecks(_parent, _args, { sub, dataSources: { wrDS } }, _info): Promise<(WrDeck | null)[] | null> {
    if (!sub) {
      return Promise.resolve(null);
    }
    return wrDS.getWrDecksFromOwnerId(sub.id);
  },
  wrCard(_parent, { id }, { dataSources: { wrDS } }, _info): Promise<WrCard | null> {
    return wrDS.getWrCard(id);
  },
  wrCardsOfDeck(_parent, { deckId }, { dataSources: { wrDS } }, _info): Promise<(WrCard | null)[] | null> {
    return wrDS.getWrCardsFromDeckId(deckId);
  },
  wrRoom(_parent, { id }, { dataSources: { wrDS } }, _info): Promise<WrRoom | null> {
    return wrDS.getWrRoom(id);
  },
  wrInRooms(_parent, _args, { sub, dataSources: { wrDS } }, _info): Promise<(WrRoom | null)[] | null> {
    if (!sub) {
      return Promise.resolve(null);
    }
    return wrDS.getWrRoomsFromOccupantId(sub.id);
  },
  wrChatMsg(_parent, { id }, { dataSources: { wrDS } }, _info): Promise<WrChatMsg | null> {
    return wrDS.getWrChatMsg(id);
  },
  wrChatMsgsOfRoom(_parent, { roomId }, { dataSources: { wrDS } }, _info): Promise<(WrChatMsg | null)[] | null> {
    return wrDS.getWrChatMsgsFromRoomId(roomId);
  },
};
