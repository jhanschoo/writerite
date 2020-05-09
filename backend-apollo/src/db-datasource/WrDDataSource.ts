import { SQLDataSource } from "datasource-sql";

import { WR_D_USER, WR_USER_COLS, WrDUser } from "./WrUser";
import type { WrUserDataSource, WrUserEditParams } from "./WrUserDataSource";
import { WR_DECK_COLS, WR_D_DECK, WrDDeck } from "./WrDeck";
import type { WrDeckCreateFromRowsParams, WrDeckCreateParams, WrDeckDataSource, WrDeckEditParams } from "./WrDeckDataSource";
import { WR_CARD_COLS, WR_D_CARD, WrDCard } from "./WrCard";
import type { WrCardCreateParams, WrCardDataSource, WrCardEditParams } from "./WrCardDataSource";
import { WR_D_SUBDECK_REL, WR_SUBDECK_REL_COLS, WrDSubdeckRel } from "./WrSubdeckRel";
import type { WrSubdeckRelCreateParams, WrSubdeckRelDataSource, WrSubdeckRelKeyParams } from "./WrSubdeckRelDataSource";
import { WR_D_ROOM, WR_ROOM_COLS, WrDRoom } from "./WrRoom";
import type { WrRoomCreateParams, WrRoomDataSource, WrRoomEditParams } from "./WrRoomDataSource";
import { WR_CHAT_MSG_COLS, WR_D_CHAT_MSG, WrDChatMsg } from "./WrChatMsg";
import type { WrChatMsgCreateParams, WrChatMsgDataSource } from "./WrChatMsgDataSource";
import { WR_D_OCCUPANCY_REL, WR_OCCUPANCY_REL_COLS, WrDOccupancyRel } from "./WrOccupancyRel";
import type { WrOccupancyRelCreateParams, WrOccupancyRelDataSource, WrOccupancyRelKeyParams } from "./WrOccupancyRelDataSource";


/*
 * We do not use mixins for now for code clarity
 * See: https://www.typescriptlang.org/docs/handbook/mixins.html for standard way to use mixins
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WrDDataSource<TContext = any, TRecord extends {} = any, TResult = any> extends SQLDataSource<TContext, TRecord, TResult> implements
  WrUserDataSource<WrDUser>,
  WrDeckDataSource<WrDDeck>,
  WrCardDataSource<WrDCard>,
  WrRoomDataSource<WrDRoom>,
  WrChatMsgDataSource<WrDChatMsg>,
  WrOccupancyRelDataSource<WrDOccupancyRel>,
  WrSubdeckRelDataSource<WrDSubdeckRel> {

  /*
   * Note that the functions are async, with await in the body so that
   * the query is triggered as soon as possible after the function is
   * called.
   * Note that .first() resolves to T | undefined, as per documentation.
   * However, typings have it resolve to T.
   */

  // WrUserDataSource<WrDUser>

  async getWrUser(id: string): Promise<WrDUser | null> {
    return await this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS)
      .where({ id })
      .first() ?? null;
  }

  getWrUsersFromName(name: string): Promise<WrDUser[]> {
    return this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS)
      .where({ name });
  }

  async getWrUserFromEmail(email: string): Promise<WrDUser | null> {
    return await this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS)
      .where({ email })
      .first() ?? null;
  }

  getWrUsersFromOccupiedRoomId(roomId: string): Promise<WrDUser[]> {
    return this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS.map((col) =>
        this.knex.ref(col).withSchema(WR_D_USER).as(col)))
      .join(WR_D_OCCUPANCY_REL, `${WR_D_USER}.id`, "=", `${WR_D_OCCUPANCY_REL}.occupantId`)
      .where(`${WR_D_OCCUPANCY_REL}.roomId`, roomId);
  }

  async editWrUser({ id, ...params }: WrUserEditParams): Promise<WrDUser | null> {
    return await this.db<WrDUser>(WR_D_USER)
      .where({ id })
      .update(params)
      .returning(WR_USER_COLS)
      .first() ?? null;
  }

  // WrDeckDataSource<WrDDeck>

  async getWrDeck(id: string): Promise<WrDDeck | null> {
    return await this.db<WrDDeck>(WR_D_DECK)
      .select(...WR_DECK_COLS)
      .where({ id })
      .first() ?? null;
  }

  getWrDecksFromOwnerId(ownerId: string): Promise<WrDDeck[]> {
    return this.db<WrDDeck>(WR_D_DECK)
      .select(...WR_DECK_COLS)
      .where({ ownerId });
  }

  getWrDecksFromParentId(parentId: string): Promise<WrDDeck[]> {
    return this.db<WrDDeck>(WR_D_DECK)
      .select(...WR_DECK_COLS.map((col) =>
        this.knex.ref(col).withSchema(WR_D_DECK).as(col)))
      .join(WR_D_SUBDECK_REL, `${WR_D_DECK}.id`, "=", `${WR_D_SUBDECK_REL}.childId`)
      .where(`${WR_D_SUBDECK_REL}.parentId`, parentId);
  }

  getWrDecksFromChildId(childId: string): Promise<WrDDeck[]> {
    return this.db<WrDDeck>(WR_D_DECK)
      .select(...WR_DECK_COLS.map((col) =>
        this.knex.ref(col).withSchema(WR_D_DECK).as(col)))
      .join(WR_D_SUBDECK_REL, `${WR_D_DECK}.id`, "=", `${WR_D_SUBDECK_REL}.parentId`)
      .where(`${WR_D_SUBDECK_REL}.childId`, childId);
  }

  async createWrDeck(params: WrDeckCreateParams): Promise<WrDDeck | null> {
    return await this.db<WrDDeck>(WR_D_DECK)
      .insert(params)
      .returning(WR_DECK_COLS)
      .first() ?? null;
  }

  createWrDeckFromRows({ rows, ...params }: WrDeckCreateFromRowsParams): Promise<WrDDeck | null> {
    const [PROMPT_COL, FULL_ANSWER_COL, ANSWERS_COL_START] = [0, 1, 2];
    return this.knex.transaction(async (trx) => {
      const deck = await trx<WrDDeck>(WR_D_DECK)
        .insert(params)
        .returning(WR_DECK_COLS)
        .first() ?? null;
      if (deck !== null) {
        await trx(WR_D_CARD)
          .insert(rows.map((row): WrCardCreateParams => ({
            deckId: deck.id,
            prompt: row[PROMPT_COL],
            fullAnswer: row[FULL_ANSWER_COL],
            answers: row.slice(ANSWERS_COL_START),
          })));
      }
      return deck;
    });
  }

  async editWrDeck({ id, ...params }: WrDeckEditParams): Promise<WrDDeck | null> {
    return await this.db<WrDDeck>(WR_D_DECK)
      .where({ id })
      .update(params)
      .returning(WR_DECK_COLS)
      .first() ?? null;
  }

  async deleteWrDeck(id: string): Promise<string> {
    await this.db<WrDDeck>(WR_D_DECK)
      .where({ id })
      .del();
    return id;
  }

  // WrCardDataSource<WrDCard>

  async getWrCard(id: string): Promise<WrDCard | null> {
    return await this.db<WrDCard>(WR_D_CARD)
      .select(...WR_CARD_COLS)
      .where({ id })
      .first() ?? null;
  }

  getWrCardsFromDeckId(deckId: string): Promise<WrDCard[]> {
    return this.db<WrDCard>(WR_D_CARD)
      .select(...WR_CARD_COLS)
      .where({ deckId });
  }

  async createWrCard(params: WrCardCreateParams): Promise<WrDCard | null> {
    return await this.db<WrDCard>(WR_D_CARD)
      .insert(params)
      .returning(WR_CARD_COLS)
      .first() ?? null;
  }

  createWrCards(params: WrCardCreateParams[]): Promise<WrDCard[]> {
    return this.db<WrDCard>(WR_D_CARD)
      .insert(params)
      .returning(WR_CARD_COLS);
  }

  async editWrCard({ id, prompt, fullAnswer, answers, sortKey, template }: WrCardEditParams): Promise<WrDCard | null> {
    return await this.db<WrDCard>(WR_D_CARD)
      .where({ id })
      .update({
        prompt, fullAnswer, answers, sortKey, template,
      })
      .returning(WR_CARD_COLS)
      .first() ?? null;
  }

  async deleteWrCard(id: string): Promise<string> {
    await this.db<WrDCard>(WR_D_CARD)
      .where({ id })
      .del();
    return id;
  }

  // WrRoomDataSource<WrDRoom>
  async getWrRoom(id: string): Promise<WrDRoom | null> {
    return await this.db<WrDRoom>(WR_D_ROOM)
      .select(...WR_ROOM_COLS)
      .where({ id })
      .first() ?? null;
  }

  getWrRoomsFromOwnerId(ownerId: string): Promise<WrDRoom[]> {
    return this.db<WrDRoom>(WR_D_ROOM)
      .select(...WR_ROOM_COLS)
      .where({ ownerId });
  }

  getWrRoomsFromOccupantId(occupantId: string): Promise<WrDRoom[]> {
    return this.db<WrDRoom>(WR_D_ROOM)
      .select(...WR_ROOM_COLS.map((col) =>
        this.knex.ref(col).withSchema(WR_D_ROOM).as(col)))
      .join(WR_D_OCCUPANCY_REL, `${WR_D_ROOM}.id`, "=", `${WR_D_OCCUPANCY_REL}.roomId`)
      .where(`${WR_D_SUBDECK_REL}.occupantId`, occupantId);
  }

  async createWrRoom({ ownerId, config }: WrRoomCreateParams): Promise<WrDRoom | null> {
    return this.knex.transaction(async (trx) => {
      const room = await trx<WrDRoom>(WR_D_ROOM)
        .insert({
          ownerId,
          config: JSON.stringify(config),
        })
        .returning(WR_ROOM_COLS)
        .first() ?? null;
      if (room !== null) {
        await trx<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
          .insert({
            roomId: room.id,
            occupantId: ownerId,
          });
      }
      return room;
    });
  }

  async editWrRoom({ id, config }: WrRoomEditParams): Promise<WrDRoom | null> {
    return await this.db<WrDRoom>(WR_D_ROOM)
      .where({ id })
      .update({
        config: JSON.stringify(config),
      })
      .returning(WR_ROOM_COLS)
      .first() ?? null;
  }

  async deleteWrRoom(id: string): Promise<string> {
    await this.db<WrDRoom>(WR_D_ROOM)
      .where({ id })
      .del();
    return id;
  }

  // WrChatMsgDataSource<WrDChatMsg>

  async getWrChatMsg(id: string): Promise<WrDChatMsg | null> {
    return await this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .select(...WR_CHAT_MSG_COLS)
      .where({ id })
      .first() ?? null;
  }

  getWrChatMsgsFromRoomId(roomId: string): Promise<WrDChatMsg[]> {
    return this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .select(...WR_CHAT_MSG_COLS)
      .where({ roomId });
  }

  async createWrChatMsg({ roomId, senderId, content, contentType }: WrChatMsgCreateParams): Promise<WrDChatMsg | null> {
    return await this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .insert({
        roomId,
        senderId,
        content,
        contentType,
      })
      .returning(WR_CHAT_MSG_COLS)
      .first() ?? null;
  }

  async deleteWrChatMsg(id: string): Promise<string> {
    await this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .where({ id })
      .del();
    return id;
  }

  // WrOccupancyRelDataSource<WrDOccupancyRel>
  async getWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<WrDOccupancyRel | null> {
    return await this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .select(...WR_OCCUPANCY_REL_COLS)
      .where(params)
      .first() ?? null;
  }

  getWrOccupancyRelsFromRoomId(roomId: string): Promise<WrDOccupancyRel[]> {
    return this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .select(...WR_OCCUPANCY_REL_COLS)
      .where({ roomId });
  }

  getWrOccupancyRelsFromOccupantId(occupantId: string): Promise<WrDOccupancyRel[]> {
    return this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .select(...WR_OCCUPANCY_REL_COLS)
      .where({ occupantId });
  }

  async createWrOccupancyRel({ roomId, occupantId }: WrOccupancyRelCreateParams): Promise<WrDOccupancyRel | null> {
    return await this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .insert({
        roomId,
        occupantId,
      })
      .returning(WR_OCCUPANCY_REL_COLS)
      .first() ?? null;
  }

  async deleteWrOccupancyRel({ roomId, occupantId }: WrOccupancyRelKeyParams): Promise<WrOccupancyRelKeyParams> {
    // explicit destructuring and restructuring for robustness
    const keys = { roomId, occupantId };
    await this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .where(keys)
      .del();
    return keys;
  }

  // WrSubdeckRelDataSource<WrDSubdeckRel>
  async getWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<WrDSubdeckRel | null> {
    return await this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .select(...WR_SUBDECK_REL_COLS)
      .where(params)
      .first() ?? null;
  }

  getWrSubdeckRelsFromParentId(parentId: string): Promise<WrDSubdeckRel[]> {
    return this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .select(...WR_SUBDECK_REL_COLS)
      .where({ parentId });
  }

  getWrSubdeckRelsFromChildId(childId: string): Promise<WrDSubdeckRel[]> {
    return this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .select(...WR_SUBDECK_REL_COLS)
      .where({ childId });
  }

  async createWrSubdeckRel({ parentId, childId }: WrSubdeckRelCreateParams): Promise<WrDSubdeckRel | null> {
    return await this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .insert({
        parentId,
        childId,
      })
      .returning(WR_SUBDECK_REL_COLS)
      .first() ?? null;
  }

  async deleteWrSubdeckRel({ parentId, childId }: WrSubdeckRelKeyParams): Promise<WrSubdeckRelKeyParams> {
    // explicit destructuring and restructuring for robustness
    const keys = { parentId, childId };
    await this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .where(keys)
      .del();
    return keys;
  }
}
