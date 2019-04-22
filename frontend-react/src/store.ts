import { createStore, Store } from 'redux';
import { rootReducer } from './reducers';

import { SidebarState } from './ui/layout/sidebar/reducers';
import { SigninState } from './modules/signin/reducers';
import { DeckState } from './modules/deck/reducers';
import { RoomState } from './modules/room/reducers';
import { CardState } from './modules/card/reducers';

export interface WrState {
  readonly sidebar?: SidebarState;
  readonly signin?: SigninState;
  readonly deck?: DeckState;
  readonly room?: RoomState;
  readonly card?: CardState;
}

type WrStore = Store<WrState>;

export const store: WrStore = createStore(
  rootReducer,
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
