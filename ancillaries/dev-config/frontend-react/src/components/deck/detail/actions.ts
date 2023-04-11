import { CardScalars } from "src/client-models/gqlTypes";

export enum ActionTypes {
  SET_ONE,
  SET_ALL,
  DELETE_ONE,
}

export interface SetOneAction {
  readonly type: ActionTypes.SET_ONE;
  readonly card: CardScalars;
}

export interface SetAllAction {
  readonly type: ActionTypes.SET_ALL;
  readonly cards: Map<string, CardScalars>;
}

export interface DeleteOneAction {
  readonly type: ActionTypes.DELETE_ONE;
  readonly id: string;
}

export type DeckDetailCardsAction = SetOneAction | SetAllAction | DeleteOneAction;

export const createSetOne = (card: CardScalars): SetOneAction => ({
  type: ActionTypes.SET_ONE,
  card,
});

export const createSetAll = (cards: CardScalars[]): SetAllAction => ({
  type: ActionTypes.SET_ALL,
  cards: cards.reduce<Map<string, CardScalars>>((res, card) => {
    res.set(card.id, card);
    return res;
  }, new Map()),
});

export const createDeleteOne = (id: string): DeleteOneAction => ({
  type: ActionTypes.DELETE_ONE,
  id,
});
