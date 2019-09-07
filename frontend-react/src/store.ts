import { createStore, Store } from 'redux';
import { rootReducer } from './reducers';

import { SidebarState } from './components/sidebar-menu/reducers';
import { SigninState } from './components/signin/reducers';

export interface WrState {
  readonly sidebar?: SidebarState;
  readonly signin?: SigninState;
}

type WrStore = Store<WrState>;

export const store: WrStore = createStore(
  rootReducer,
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
