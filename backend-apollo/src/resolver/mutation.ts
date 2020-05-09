import { IFieldResolver } from "apollo-server-koa";
import { WrContext } from "../types";
import { WrSigninOpts, WrAuthResponse } from "../datasource/WrAuthorization";
import { WrDeckCreateOpts, WrDeckEditOpts, WrDeck } from "../datasource/WrDeck";
import { WrCardCreateOpts, WrCardEditOpts, WrCard } from "../datasource/WrCard";
import { WrRoomConfig, WrRoom } from "../datasource/WrRoom";
import { WrChatMsg, WrChatMsgCreateOpts } from "../datasource/WrChatMsg";
import { WrUser } from "../datasource/WrUser";

interface WrMutation {
  signin: IFieldResolver<unknown, WrContext, { opts: WrSigninOpts }>;
  wrUserEdit: IFieldResolver<unknown, WrContext, { name: string }>;
  wrDeckCreate: IFieldResolver<unknown, WrContext, {
    opts: WrDeckCreateOpts;
  }>;
  wrDeckCreateFromRows: IFieldResolver<unknown, WrContext, {
    opts: WrDeckCreateOpts;
    rows: string[][]
  }>;
  wrDeckEdit: IFieldResolver<unknown, WrContext, {
    opts: WrDeckEditOpts;
  }>;
  wrDeckAddSubdeck: IFieldResolver<unknown, WrContext, {
    id: string;
    subdeckId: string;
  }>;
  wrDeckRemoveSubdeck: IFieldResolver<unknown, WrContext, {
    parentId: string;
    subdeckId: string;
  }>;
  wrDeckDelete: IFieldResolver<unknown, WrContext, {
    id: string;
  }>;
  wrCardCreate: IFieldResolver<unknown, WrContext, {
    opts: WrCardCreateOpts;
  }>;
  wrCardsCreate: IFieldResolver<unknown, WrContext, {
    opts: WrCardCreateOpts;
    multiplicity: number;
  }>;
  wrCardEdit: IFieldResolver<unknown, WrContext, {
    opts: WrCardEditOpts;
  }>;
  wrCardDelete: IFieldResolver<unknown, WrContext, {
    id: string;
  }>;

  wrRoomCreate: IFieldResolver<unknown, WrContext, {
    config: WrRoomConfig;
  }>;
  wrRoomUpdateConfig: IFieldResolver<unknown, WrContext, {
    id: string;
    config: WrRoomConfig;
  }>;
  wrRoomAddOccupant: IFieldResolver<unknown, WrContext, {
    id: string;
    occupantId: string;
  }>;
  wrRoomArchive: IFieldResolver<unknown, WrContext, {
    id: string;
  }>;
  wrChatMsgCreate: IFieldResolver<unknown, WrContext, {
    opts: WrChatMsgCreateOpts;
  }>;
}

export const Mutation: WrMutation = {
  signin(_parent, { opts }, context, _info): Promise<WrAuthResponse | null> {

  },
  wrUserEdit(_parent, { name }, { sub, dataSources: { wrDS } }, _info) {
    if (!sub) {
      return null;
    }
    return wrDS.editWrUser({ name })
  },
  wrUserEdit(_parent, { name }, { dataSources: { wrDS } }, _info): Promise<WrUser | null> {

  },
  wrDeckCreate(_parent, { opts }, context, _info): Promise<WrDeck | null> {

  },
  wrDeckCreateFromRows(_parent, { opts, rows }, context, _info): Promise<WrDeck | null> {

  },
  wrDeckEdit(_parent, { opts }, context, _info): Promise<WrDeck | null> {

  },
  wrDeckAddSubdeck(_parent, { id, subdeckId }, context, _info): Promise<WrDeck | null> {

  },
  wrDeckRemoveSubdeck(_parent, { id, subdeckId }, context, _info): Promise<WrDeck | null> {

  },
  wrDeckDelete(_parent, { id }, context, _info): Promise<string | null> {

  },
  wrCardCreate(_parent, { opts }, context, _info): Promise<WrCard | null> {

  },
  wrCardsCreate(_parent, { opts, multiplicity }, context, _info): Promise<WrCard | null> {

  },
  wrCardsCreate(_parent, { opts, multiplicity }, context, _info): Promise<(WrCard | null)[] | null> {

  },
  wrCardEdit(_parent, { opts }, context, _info): Promise<WrCard | null> {

  },
  wrCardDelete(_parent, { id }, context, _info): Promise<string | null> {

  },
  wrRoomCreate(_parent, { config }, context, _info): Promise<WrRoom | null> {

  },
  wrRoomUpdateConfig(_parent, { id, config }, context, _info): Promise<WrRoom | null> {

  },
  wrRoomAddOccupant(_parent, { id, occupantId }, context, _info): Promise<WrRoom | null> {

  },
  wrRoomArchive(_parent, { id }, context, _info): Promise<WrRoom | null> {

  },
  wrChatMsgCreate(_parent, { opts: { roomId, content, contentType } }, { sub, dataSources: { wrDS } }, _info): Promise<WrChatMsg | null> {
    if (!sub) {
      return Promise.resolve(null);
    }
    return wrDS.createWrChatMsg({ roomId, senderId: sub.id, content, contentType });
  },

};