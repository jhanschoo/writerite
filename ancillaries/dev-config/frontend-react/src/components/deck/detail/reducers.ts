import { Reducer } from "redux";
import { ActionTypes, DeckDetailCardsAction } from "./actions";

import { CardScalars } from "src/gqlTypes";

export interface DeckDetailCardsState {
  cards: Map<string, CardScalars> | null;
}

export const initialState: DeckDetailCardsState = {
  cards: null,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const deckDetailCards: Reducer<DeckDetailCardsState, DeckDetailCardsAction> = (state = initialState, action: DeckDetailCardsAction): DeckDetailCardsState => {
  switch (action.type) {
    case ActionTypes.SET_ALL:
      return { cards: action.cards };
    case ActionTypes.SET_ONE:
      if (!state.cards) {
        return state;
      }
      const setOneCards = new Map(state.cards);
      setOneCards.set(action.card.id, action.card);
      return { cards: setOneCards };
    case ActionTypes.DELETE_ONE:
      if (!state.cards) {
        return state;
      }
      const deleteCards = new Map(state.cards);
      deleteCards.delete(action.id);
      return { cards: deleteCards };
    default:
      return state;
  }
};
