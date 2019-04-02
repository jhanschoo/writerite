import { ActionTypes, DeckAction } from './actions';

export interface DeckState {
  filter: string;
}

export const initialState: DeckState = {
  filter: '',
};

export const deck = (
  state: DeckState = initialState, action: DeckAction,
): DeckState => {
  const { type, filter } = action;
  switch (type) {
    case ActionTypes.SET_DECK_FILTER:
      return Object.assign({}, state, {
        filter,
      });
    default:
      return state;
  }
};
