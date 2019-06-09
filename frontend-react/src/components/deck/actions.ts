import { initialState } from './reducers';

export enum ActionTypes {
  SET_DECK_FILTER = 'SET_DECK_FILTER',
}

export interface SetDeckFilterAction {
  readonly type: ActionTypes.SET_DECK_FILTER;
  readonly filter: string;
}

export type DeckAction = SetDeckFilterAction;

export const setDeckFilter = (filter: string): SetDeckFilterAction => {
  return {
    type: ActionTypes.SET_DECK_FILTER,
    filter,
  };
};

export const resetDeckFilter = (): SetDeckFilterAction => {
  return setDeckFilter(initialState.filter);
};
