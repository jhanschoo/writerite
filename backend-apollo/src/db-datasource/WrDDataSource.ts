import { SQLDataSource } from "datasource-sql";

import { WR_D_USER, WR_USER_COLS, WrDUser, WrUserDataSource, WrUserEditParams } from "./WrUser";
import { WR_DECK_COLS, WR_D_DECK, WrDDeck, WrDeckCreateFromRowsParams, WrDeckCreateParams, WrDeckDataSource, WrDeckEditParams } from "./WrDeck";
import { WR_CARD_COLS, WR_D_CARD, WrCardCreateParams, WrCardDataSource, WrCardEditParams, WrDCard } from "./WrCard";
import { WR_D_SUBDECK_REL, WR_SUBDECK_REL_COLS, WrDSubdeckRel, WrSubdeckRelCreateParams, WrSubdeckRelDataSource, WrSubdeckRelKeyParams } from "./WrSubdeckRel";
import { WR_D_ROOM, WR_ROOM_COLS, WrDRoom, WrRoomCreateParams, WrRoomDataSource, WrRoomEditParams } from "./WrRoom";
import { WR_CHAT_MSG_COLS, WR_D_CHAT_MSG, WrChatMsgCreateParams, WrChatMsgDataSource, WrDChatMsg } from "./WrChatMsg";
import { WR_D_OCCUPANCY_REL, WR_OCCUPANCY_REL_COLS, WrDOccupancyRel, WrOccupancyRelCreateParams, WrOccupancyRelDataSource, WrOccupancyRelKeyParams } from "./WrOccupancyRel";


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

  getWrUser(id: string): Promise<WrDUser | undefined> {
    return this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS)
      .where({ id })
      .first();
  }

  getWrUsersFromName(name: string): Promise<WrDUser[]> {
    return this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS)
      .where({ name });
  }

  getWrUserFromEmail(email: string): Promise<WrDUser | undefined> {
    return this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS)
      .where({ email })
      .first();
  }

  getWrUsersFromOccupiedRoomId(roomId: string): Promise<WrDUser[]> {
    return this.db<WrDUser>(WR_D_USER)
      .select(...WR_USER_COLS.map((col) =>
        this.knex.ref(col).withSchema(WR_D_USER).as(col)))
      .join(WR_D_OCCUPANCY_REL, `${WR_D_USER}.id`, "=", `${WR_D_OCCUPANCY_REL}.occupantId`)
      .where(`${WR_D_OCCUPANCY_REL}.roomId`, roomId);
  }

  editWrUser({ id, ...params }: WrUserEditParams): Promise<WrDUser | undefined> {
    return this.db<WrDUser>(WR_D_USER)
      .where({ id })
      .update(params)
      .returning(WR_USER_COLS)
      .first();
  }

  // WrDeckDataSource<WrDDeck>

  getWrDeck(id: string): Promise<WrDDeck | undefined> {
    return this.db<WrDDeck>(WR_D_DECK)
      .select(...WR_DECK_COLS)
      .where({ id })
      .first();
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

  createWrDeck(params: WrDeckCreateParams): Promise<WrDDeck | undefined> {
    return this.db<WrDDeck>(WR_D_DECK)
      .insert(params)
      .returning(WR_DECK_COLS)
      .first();
  }

  async createWrDeckFromRows({ rows, ...params }: WrDeckCreateFromRowsParams): Promise<WrDDeck | undefined> {
    const [PROMPT_COL, FULL_ANSWER_COL, ANSWERS_COL_START] = [0, 1, 2];
    const deck = await this.db<WrDDeck>(WR_D_DECK)
      .insert(params)
      .returning(WR_DECK_COLS)
      .first();
    if (deck !== undefined) {
      await this.db<WrDCard>(WR_D_CARD)
        .insert(rows.map((row): WrCardCreateParams => ({
          deckId: deck.id,
          prompt: row[PROMPT_COL],
          fullAnswer: row[FULL_ANSWER_COL],
          answers: row.slice(ANSWERS_COL_START),
        })));
    }
    return deck;
  }

  editWrDeck({ id, ...params }: WrDeckEditParams): Promise<WrDDeck | undefined> {
    return this.db<WrDDeck>(WR_D_DECK)
      .where({ id })
      .update(params)
      .returning(WR_DECK_COLS)
      .first();
  }

  async deleteWrDeck(id: string): Promise<string> {
    const n = await this.db<WrDDeck>(WR_D_DECK)
      .where({ id })
      .del();
    if (n !== 1) {
      throw new Error(`deleting a WrDDeck but ${n} were deleted`);
    }
    return id;
  }

  // WrCardDataSource<WrDCard>

  getWrCard(id: string): Promise<WrDCard | undefined> {
    return this.db<WrDCard>(WR_D_CARD)
      .select(...WR_CARD_COLS)
      .where({ id })
      .first();
  }

  getWrCardsFromDeckId(deckId: string): Promise<WrDCard[]> {
    return this.db<WrDCard>(WR_D_CARD)
      .select(...WR_CARD_COLS)
      .where({ deckId });
  }

  createWrCard(params: WrCardCreateParams): Promise<WrDCard | undefined> {
    return this.db<WrDCard>(WR_D_CARD)
      .insert(params)
      .returning(WR_CARD_COLS)
      .first();
  }

  createWrCards(params: WrCardCreateParams[]): Promise<WrDCard[]> {
    return this.db<WrDCard>(WR_D_CARD)
      .insert(params)
      .returning(WR_CARD_COLS);
  }

  editWrCard({ id, prompt, fullAnswer, answers, sortKey, template }: WrCardEditParams): Promise<WrDCard | undefined> {
    return this.db<WrDCard>(WR_D_CARD)
      .where({ id })
      .update({
        prompt, fullAnswer, answers, sortKey, template,
      })
      .returning(WR_CARD_COLS)
      .first();
  }

  async deleteWrCard(id: string): Promise<string> {
    const n = await this.db<WrDCard>(WR_D_CARD)
      .where({ id })
      .del();
    if (n !== 1) {
      throw new Error(`deleting a WrDCard but ${n} were deleted`);
    }
    return id;
  }

  // WrRoomDataSource<WrDRoom>
  getWrRoom(id: string): Promise<WrDRoom | undefined> {
    return this.db<WrDRoom>(WR_D_ROOM)
      .select(...WR_ROOM_COLS)
      .where({ id })
      .first();
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

  createWrRoom({ ownerId, config }: WrRoomCreateParams): Promise<WrDRoom | undefined> {
    return this.db<WrDRoom>(WR_D_ROOM)
      .insert({
        ownerId,
        config: JSON.stringify(config),
      })
      .returning(WR_ROOM_COLS)
      .first();
  }

  editWrRoom({ id, config }: WrRoomEditParams): Promise<WrDRoom | undefined> {
    return this.db<WrDRoom>(WR_D_ROOM)
      .where({ id })
      .update({
        config: JSON.stringify(config),
      })
      .returning(WR_ROOM_COLS)
      .first();
  }

  async deleteWrRoom(id: string): Promise<string> {
    const n = await this.db<WrDRoom>(WR_D_ROOM)
      .where({ id })
      .del();
    if (n !== 1) {
      throw new Error(`deleting a WrDRoom but ${n} were deleted`);
    }
    return id;
  }

  // WrChatMsgDataSource<WrDChatMsg>

  getWrChatMsg(id: string): Promise<WrDChatMsg | undefined> {
    return this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .select(...WR_CHAT_MSG_COLS)
      .where({ id })
      .first();
  }

  getWrChatMsgsFromRoomId(roomId: string): Promise<WrDChatMsg[]> {
    return this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .select(...WR_CHAT_MSG_COLS)
      .where({ roomId });

  }

  createWrChatMsg({ roomId, senderId, content, contentType }: WrChatMsgCreateParams): Promise<WrDChatMsg | undefined> {
    return this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .insert({
        roomId,
        senderId,
        content,
        contentType,
      })
      .returning(WR_CHAT_MSG_COLS)
      .first();
  }

  async deleteWrChatMsg(id: string): Promise<string> {
    const n = await this.db<WrDChatMsg>(WR_D_CHAT_MSG)
      .where({ id })
      .del();
    if (n !== 1) {
      throw new Error(`deleting a WrDChatMsg but ${n} were deleted`);
    }
    return id;
  }

  // WrOccupancyRelDataSource<WrDOccupancyRel>
  getWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<WrDOccupancyRel | undefined> {
    return this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .select(...WR_OCCUPANCY_REL_COLS)
      .where(params)
      .first();
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

  createWrOccupancyRel({ roomId, occupantId }: WrOccupancyRelCreateParams): Promise<WrDOccupancyRel | undefined> {
    return this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .insert({
        roomId,
        occupantId,
      })
      .returning(WR_OCCUPANCY_REL_COLS)
      .first();
  }

  async deleteWrOccupancyRel({ roomId, occupantId }: WrOccupancyRelKeyParams): Promise<WrOccupancyRelKeyParams> {
    // explicit destructuring and restructuring for robustness
    const keys = { roomId, occupantId };
    const n = await this.db<WrDOccupancyRel>(WR_D_OCCUPANCY_REL)
      .where(keys)
      .del();
    if (n !== 1) {
      throw new Error(`deleting a WrDOccupancyRel but ${n} were deleted`);
    }
    return keys;
  }

  // WrSubdeckRelDataSource<WrDSubdeckRel>
  getWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<WrDSubdeckRel | undefined> {
    return this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .select(...WR_SUBDECK_REL_COLS)
      .where(params)
      .first();
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

  createWrSubdeckRel({ parentId, childId }: WrSubdeckRelCreateParams): Promise<WrDSubdeckRel | undefined> {
    return this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .insert({
        parentId,
        childId,
      })
      .returning(WR_SUBDECK_REL_COLS)
      .first();
  }

  async deleteWrSubdeckRel({ parentId, childId }: WrSubdeckRelKeyParams): Promise<WrSubdeckRelKeyParams> {
    // explicit destructuring and restructuring for robustness
    const keys = { parentId, childId };
    const n = await this.db<WrDSubdeckRel>(WR_D_SUBDECK_REL)
      .where(keys)
      .del();
    if (n !== 1) {
      throw new Error(`deleting a WrDSubdeckRel but ${n} were deleted`);
    }
    return keys;
  }
}
