import { DataSource, DataSourceConfig } from "apollo-datasource";
import type { KeyValueCache } from "apollo-server-caching";

import { WrUserDataSource, WrUserEditParams } from "../db-datasource/WrUser";
import { WrDeckCreateFromRowsParams, WrDeckCreateParams, WrDeckDataSource, WrDeckEditParams } from "../db-datasource/WrDeck";
import { WrCardCreateParams, WrCardDataSource, WrCardEditParams } from "../db-datasource/WrCard";
import { WrRoomCreateParams, WrRoomDataSource, WrRoomEditParams } from "../db-datasource/WrRoom";
import { WrChatMsgCreateParams, WrChatMsgDataSource } from "../db-datasource/WrChatMsg";
import { WrOccupancyRelCreateParams, WrOccupancyRelDataSource, WrOccupancyRelKeyParams } from "../db-datasource/WrOccupancyRel";
import { WrSubdeckRelCreateParams, WrSubdeckRelDataSource, WrSubdeckRelKeyParams } from "../db-datasource/WrSubdeckRel";
import { WrRSubdeckRel, mapWrBSubdeckRelToWrRSubdeckRel } from "./WrSubdeckRel";
import { WrROccupancyRel, mapWrBOccupancyRelToWrROccupancyRel } from "./WrOccupancyRel";
import { WrRChatMsg, mapWrBChatMsgToWrRChatMsg } from "./WrChatMsg";
import { WrRRoom, mapWrBRoomToWrRRoom } from "./WrRoom";
import { WrRCard, mapWrBCardToWrRCard } from "./WrCard";
import { WrRDeck, mapWrBDeckToWrRDeck } from "./WrDeck";
import { WrRUser, mapWrBUserToWrRUser } from "./WrUser";
import { WrDDataSource } from "../db-datasource/WrDDataSource";

/*
 * We do not use mixins for now for code clarity
 * See: https://www.typescriptlang.org/docs/handbook/mixins.html for standard way to use mixins
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WrRDataSource<TContext = any, TRecord extends {} = any, TResult = any> extends DataSource<TContext> implements
  WrUserDataSource<WrRUser>,
  WrDeckDataSource<WrRDeck>,
  WrCardDataSource<WrRCard>,
  WrRoomDataSource<WrRRoom>,
  WrChatMsgDataSource<WrRChatMsg>,
  WrOccupancyRelDataSource<WrROccupancyRel>,
  WrSubdeckRelDataSource<WrRSubdeckRel> {
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

  async getWrUser(id: string): Promise<WrRUser | undefined> {
    return mapWrBUserToWrRUser(await this.wrDDS.getWrUser(id), this.wrDDS);
  }

  async getWrUsersFromName(name: string): Promise<WrRUser[]> {
    return Promise.all((await this.wrDDS.getWrUsersFromName(name)).map((dUser) => mapWrBUserToWrRUser(dUser, this.wrDDS)));
  }

  async getWrUserFromEmail(email: string): Promise<WrRUser | undefined> {
    return mapWrBUserToWrRUser(await this.wrDDS.getWrUserFromEmail(email), this.wrDDS);
  }

  async getWrUsersFromOccupiedRoomId(roomId: string): Promise<WrRUser[]> {
    return Promise.all((await this.wrDDS.getWrUsersFromOccupiedRoomId(roomId)).map((dUser) => mapWrBUserToWrRUser(dUser, this.wrDDS)));
  }

  async editWrUser(params: WrUserEditParams): Promise<WrRUser | undefined> {
    return mapWrBUserToWrRUser(await this.wrDDS.editWrUser(params), this.wrDDS);
  }

  // WrDeckDataSource<WrRDeck>

  async getWrDeck(id: string): Promise<WrRDeck | undefined> {
    return mapWrBDeckToWrRDeck(await this.wrDDS.getWrDeck(id), this.wrDDS);
  }

  async getWrDecksFromOwnerId(ownerId: string): Promise<WrRDeck[]> {
    return Promise.all((await this.wrDDS.getWrDecksFromOwnerId(ownerId)).map((dDeck) => mapWrBDeckToWrRDeck(dDeck, this.wrDDS)));
  }

  async getWrDecksFromParentId(parentId: string): Promise<WrRDeck[]> {
    return Promise.all((await this.wrDDS.getWrDecksFromParentId(parentId)).map((dDeck) => mapWrBDeckToWrRDeck(dDeck, this.wrDDS)));
  }

  async getWrDecksFromChildId(childId: string): Promise<WrRDeck[]> {
    return Promise.all((await this.wrDDS.getWrDecksFromChildId(childId)).map((dDeck) => mapWrBDeckToWrRDeck(dDeck, this.wrDDS)));
  }

  async createWrDeck(params: WrDeckCreateParams): Promise<WrRDeck | undefined> {
    return mapWrBDeckToWrRDeck(await this.wrDDS.createWrDeck(params), this.wrDDS);
  }

  async createWrDeckFromRows(params: WrDeckCreateFromRowsParams): Promise<WrRDeck | undefined> {
    return mapWrBDeckToWrRDeck(await this.wrDDS.createWrDeckFromRows(params), this.wrDDS);
  }

  async editWrDeck(params: WrDeckEditParams): Promise<WrRDeck | undefined> {
    return mapWrBDeckToWrRDeck(await this.wrDDS.editWrDeck(params), this.wrDDS);
  }

  deleteWrDeck(id: string): Promise<string> {
    return this.wrDDS.deleteWrDeck(id);
  }

  // WrCardDataSource<WrDCard>

  async getWrCard(id: string): Promise<WrRCard | undefined> {
    return mapWrBCardToWrRCard(await this.wrDDS.getWrCard(id), this.wrDDS);
  }

  async getWrCardsFromDeckId(deckId: string): Promise<WrRCard[]> {
    return Promise.all((await this.wrDDS.getWrCardsFromDeckId(deckId)).map((dCard) => mapWrBCardToWrRCard(dCard, this.wrDDS)));
  }

  async createWrCard(params: WrCardCreateParams): Promise<WrRCard | undefined> {
    return mapWrBCardToWrRCard(await this.wrDDS.createWrCard(params), this.wrDDS);
  }

  async createWrCards(params: WrCardCreateParams[]): Promise<WrRCard[]> {
    return Promise.all((await this.wrDDS.createWrCards(params)).map((dCard) => mapWrBCardToWrRCard(dCard, this.wrDDS)));
  }

  async editWrCard(params: WrCardEditParams): Promise<WrRCard | undefined> {
    return mapWrBCardToWrRCard(await this.wrDDS.editWrCard(params), this.wrDDS);
  }

  deleteWrCard(id: string): Promise<string> {
    return this.wrDDS.deleteWrCard(id);
  }

  // WrRoomDataSource<WrRRoom>
  async getWrRoom(id: string): Promise<WrRRoom | undefined> {
    return mapWrBRoomToWrRRoom(await this.wrDDS.getWrRoom(id), this.wrDDS);
  }

  async getWrRoomsFromOwnerId(ownerId: string): Promise<WrRRoom[]> {
    return Promise.all((await this.wrDDS.getWrRoomsFromOwnerId(ownerId)).map((dRoom) => mapWrBRoomToWrRRoom(dRoom, this.wrDDS)));
  }

  async getWrRoomsFromOccupantId(occupantId: string): Promise<WrRRoom[]> {
    return Promise.all((await this.wrDDS.getWrRoomsFromOccupantId(occupantId)).map((dRoom) => mapWrBRoomToWrRRoom(dRoom, this.wrDDS)));
  }

  async createWrRoom(params: WrRoomCreateParams): Promise<WrRRoom | undefined> {
    return mapWrBRoomToWrRRoom(await this.wrDDS.createWrRoom(params), this.wrDDS);
  }

  async editWrRoom(params: WrRoomEditParams): Promise<WrRRoom | undefined> {
    return mapWrBRoomToWrRRoom(await this.wrDDS.editWrRoom(params), this.wrDDS);
  }

  deleteWrRoom(id: string): Promise<string> {
    return this.wrDDS.deleteWrRoom(id);
  }

  // WrChatMsgDataSource<WrDChatMsg>

  async getWrChatMsg(id: string): Promise<WrRChatMsg | undefined> {
    return mapWrBChatMsgToWrRChatMsg(await this.wrDDS.getWrChatMsg(id), this.wrDDS);
  }

  async getWrChatMsgsFromRoomId(roomId: string): Promise<WrRChatMsg[]> {
    return Promise.all((await this.wrDDS.getWrChatMsgsFromRoomId(roomId)).map((dChatMsg) => mapWrBChatMsgToWrRChatMsg(dChatMsg, this.wrDDS)));
  }

  async createWrChatMsg(params: WrChatMsgCreateParams): Promise<WrRChatMsg | undefined> {
    return mapWrBChatMsgToWrRChatMsg(await this.createWrChatMsg(params), this.wrDDS);
  }

  deleteWrChatMsg(id: string): Promise<string> {
    return this.wrDDS.deleteWrChatMsg(id);
  }

  // WrOccupancyRelDataSource<WrDOccupancyRel>
  async getWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<WrROccupancyRel | undefined> {
    return mapWrBOccupancyRelToWrROccupancyRel(await this.wrDDS.getWrOccupancyRel(params), this.wrDDS);
  }

  async getWrOccupancyRelsFromRoomId(roomId: string): Promise<WrROccupancyRel[]> {
    return Promise.all((await this.wrDDS.getWrOccupancyRelsFromRoomId(roomId)).map((dOccupancyRel) => mapWrBOccupancyRelToWrROccupancyRel(dOccupancyRel, this.wrDDS)));
  }

  async getWrOccupancyRelsFromOccupantId(occupantId: string): Promise<WrROccupancyRel[]> {
    return Promise.all((await this.wrDDS.getWrOccupancyRelsFromOccupantId(occupantId)).map((dOccupancyRel) => mapWrBOccupancyRelToWrROccupancyRel(dOccupancyRel, this.wrDDS)));
  }

  async createWrOccupancyRel(params: WrOccupancyRelCreateParams): Promise<WrROccupancyRel | undefined> {
    return mapWrBOccupancyRelToWrROccupancyRel(await this.wrDDS.createWrOccupancyRel(params), this.wrDDS);
  }

  deleteWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<WrOccupancyRelKeyParams> {
    return this.wrDDS.deleteWrOccupancyRel(params);
  }

  // WrSubdeckRelDataSource<WrDSubdeckRel>
  async getWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<WrRSubdeckRel | undefined> {
    return mapWrBSubdeckRelToWrRSubdeckRel(await this.wrDDS.getWrSubdeckRel(params), this.wrDDS);
  }

  async getWrSubdeckRelsFromParentId(parentId: string): Promise<WrRSubdeckRel[]> {
    return Promise.all((await this.wrDDS.getWrSubdeckRelsFromParentId(parentId)).map((dSubdeckRel) => mapWrBSubdeckRelToWrRSubdeckRel(dSubdeckRel, this.wrDDS)));
  }

  async getWrSubdeckRelsFromChildId(childId: string): Promise<WrRSubdeckRel[]> {
    return Promise.all((await this.wrDDS.getWrSubdeckRelsFromChildId(childId)).map((dSubdeckRel) => mapWrBSubdeckRelToWrRSubdeckRel(dSubdeckRel, this.wrDDS)));
  }

  async createWrSubdeckRel(params: WrSubdeckRelCreateParams): Promise<WrRSubdeckRel | undefined> {
    return mapWrBSubdeckRelToWrRSubdeckRel(await this.wrDDS.createWrSubdeckRel(params), this.wrDDS);
  }

  deleteWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<WrSubdeckRelKeyParams> {
    return this.wrDDS.deleteWrSubdeckRel(params);
  }
}
