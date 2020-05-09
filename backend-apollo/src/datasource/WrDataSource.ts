import { DataSource, DataSourceConfig } from "apollo-datasource";
import type { KeyValueCache } from "apollo-server-caching";

import { WrUser, mapWrDUserToWrUser } from "./WrUser";
import type { WrUserDataSource, WrUserEditParams } from "../db-datasource/WrUserDataSource";
import { WrDeck, mapWrDDeckToWrDeck } from "./WrDeck";
import type { WrDeckCreateFromRowsParams, WrDeckCreateParams, WrDeckDataSource, WrDeckEditParams } from "../db-datasource/WrDeckDataSource";
import { WrCard, mapWrDCardToWrCard } from "./WrCard";
import type { WrCardCreateParams, WrCardDataSource, WrCardEditParams } from "../db-datasource/WrCardDataSource";
import { WrRoom, mapWrDRoomToWrRoom } from "./WrRoom";
import type { WrRoomCreateParams, WrRoomDataSource, WrRoomEditParams } from "../db-datasource/WrRoomDataSource";
import { WrChatMsg, mapWrDChatMsgToWrChatMsg } from "./WrChatMsg";
import type { WrChatMsgCreateParams, WrChatMsgDataSource } from "../db-datasource/WrChatMsgDataSource";
import { WrDDataSource } from "../db-datasource/WrDDataSource";

/*
 * We do not use mixins for now for code clarity
 * See: https://www.typescriptlang.org/docs/handbook/mixins.html for standard way to use mixins
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WrDataSource<TContext = any, TRecord extends {} = any, TResult = any> extends DataSource<TContext> implements
  WrUserDataSource<WrUser>,
  WrDeckDataSource<WrDeck>,
  WrCardDataSource<WrCard>,
  WrRoomDataSource<WrRoom>,
  WrChatMsgDataSource<WrChatMsg> {
  context?: TContext;

  cache?: KeyValueCache;

  constructor(private readonly wrDDS: WrDDataSource<TContext, TRecord, TResult>) {
    super();
  }

  initialize(config: DataSourceConfig<TContext>): void {
    this.wrDDS.initialize(config);
    this.context = this.wrDDS.context;
    this.cache = this.wrDDS.cache;
  }

  // WrUserDataSource<WrRUser>

  async getWrUser(id: string): Promise<WrUser | null> {
    return mapWrDUserToWrUser(await this.wrDDS.getWrUser(id), this.wrDDS);
  }

  async getWrUsersFromName(name: string): Promise<WrUser[]> {
    return Promise.all((await this.wrDDS.getWrUsersFromName(name)).map((dUser) => mapWrDUserToWrUser(dUser, this.wrDDS)));
  }

  async getWrUserFromEmail(email: string): Promise<WrUser | null> {
    return mapWrDUserToWrUser(await this.wrDDS.getWrUserFromEmail(email), this.wrDDS);
  }

  async getWrUsersFromOccupiedRoomId(roomId: string): Promise<WrUser[]> {
    return Promise.all((await this.wrDDS.getWrUsersFromOccupiedRoomId(roomId)).map((dUser) => mapWrDUserToWrUser(dUser, this.wrDDS)));
  }

  async editWrUser(params: WrUserEditParams): Promise<WrUser | null> {
    return mapWrDUserToWrUser(await this.wrDDS.editWrUser(params), this.wrDDS);
  }

  // WrDeckDataSource<WrDeck>

  async getWrDeck(id: string): Promise<WrDeck | null> {
    return mapWrDDeckToWrDeck(await this.wrDDS.getWrDeck(id), this.wrDDS);
  }

  async getWrDecksFromOwnerId(ownerId: string): Promise<WrDeck[]> {
    return Promise.all((await this.wrDDS.getWrDecksFromOwnerId(ownerId)).map((dDeck) => mapWrDDeckToWrDeck(dDeck, this.wrDDS)));
  }

  async getWrDecksFromParentId(parentId: string): Promise<WrDeck[]> {
    return Promise.all((await this.wrDDS.getWrDecksFromParentId(parentId)).map((dDeck) => mapWrDDeckToWrDeck(dDeck, this.wrDDS)));
  }

  async getWrDecksFromChildId(childId: string): Promise<WrDeck[]> {
    return Promise.all((await this.wrDDS.getWrDecksFromChildId(childId)).map((dDeck) => mapWrDDeckToWrDeck(dDeck, this.wrDDS)));
  }

  async createWrDeck(params: WrDeckCreateParams): Promise<WrDeck | null> {
    return mapWrDDeckToWrDeck(await this.wrDDS.createWrDeck(params), this.wrDDS);
  }

  async createWrDeckFromRows(params: WrDeckCreateFromRowsParams): Promise<WrDeck | null> {
    return mapWrDDeckToWrDeck(await this.wrDDS.createWrDeckFromRows(params), this.wrDDS);
  }

  async editWrDeck(params: WrDeckEditParams): Promise<WrDeck | null> {
    return mapWrDDeckToWrDeck(await this.wrDDS.editWrDeck(params), this.wrDDS);
  }

  deleteWrDeck(id: string): Promise<string> {
    return this.wrDDS.deleteWrDeck(id);
  }

  // WrCardDataSource<WrDCard>

  async getWrCard(id: string): Promise<WrCard | null> {
    return mapWrDCardToWrCard(await this.wrDDS.getWrCard(id), this.wrDDS);
  }

  async getWrCardsFromDeckId(deckId: string): Promise<WrCard[]> {
    return Promise.all((await this.wrDDS.getWrCardsFromDeckId(deckId)).map((dCard) => mapWrDCardToWrCard(dCard, this.wrDDS)));
  }

  async createWrCard(params: WrCardCreateParams): Promise<WrCard | null> {
    return mapWrDCardToWrCard(await this.wrDDS.createWrCard(params), this.wrDDS);
  }

  async createWrCards(params: WrCardCreateParams[]): Promise<WrCard[]> {
    return Promise.all((await this.wrDDS.createWrCards(params)).map((dCard) => mapWrDCardToWrCard(dCard, this.wrDDS)));
  }

  async editWrCard(params: WrCardEditParams): Promise<WrCard | null> {
    return mapWrDCardToWrCard(await this.wrDDS.editWrCard(params), this.wrDDS);
  }

  deleteWrCard(id: string): Promise<string> {
    return this.wrDDS.deleteWrCard(id);
  }

  // WrRoomDataSource<WrRoom>
  async getWrRoom(id: string): Promise<WrRoom | null> {
    return mapWrDRoomToWrRoom(await this.wrDDS.getWrRoom(id), this.wrDDS);
  }

  async getWrRoomsFromOwnerId(ownerId: string): Promise<WrRoom[]> {
    return Promise.all((await this.wrDDS.getWrRoomsFromOwnerId(ownerId)).map((dRoom) => mapWrDRoomToWrRoom(dRoom, this.wrDDS)));
  }

  async getWrRoomsFromOccupantId(occupantId: string): Promise<WrRoom[]> {
    return Promise.all((await this.wrDDS.getWrRoomsFromOccupantId(occupantId)).map((dRoom) => mapWrDRoomToWrRoom(dRoom, this.wrDDS)));
  }

  async createWrRoom(params: WrRoomCreateParams): Promise<WrRoom | null> {
    return mapWrDRoomToWrRoom(await this.wrDDS.createWrRoom(params), this.wrDDS);
  }

  async editWrRoom(params: WrRoomEditParams): Promise<WrRoom | null> {
    return mapWrDRoomToWrRoom(await this.wrDDS.editWrRoom(params), this.wrDDS);
  }

  deleteWrRoom(id: string): Promise<string> {
    return this.wrDDS.deleteWrRoom(id);
  }

  // WrChatMsgDataSource<WrDChatMsg>

  async getWrChatMsg(id: string): Promise<WrChatMsg | null> {
    return mapWrDChatMsgToWrChatMsg(await this.wrDDS.getWrChatMsg(id), this.wrDDS);
  }

  async getWrChatMsgsFromRoomId(roomId: string): Promise<WrChatMsg[]> {
    return Promise.all((await this.wrDDS.getWrChatMsgsFromRoomId(roomId)).map((dChatMsg) => mapWrDChatMsgToWrChatMsg(dChatMsg, this.wrDDS)));
  }

  async createWrChatMsg(params: WrChatMsgCreateParams): Promise<WrChatMsg | null> {
    return mapWrDChatMsgToWrChatMsg(await this.wrDDS.createWrChatMsg(params), this.wrDDS);
  }

  deleteWrChatMsg(id: string): Promise<string> {
    return this.wrDDS.deleteWrChatMsg(id);
  }
}
