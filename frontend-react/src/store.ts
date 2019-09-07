import { createStore, Store } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './reducers';

import { SidebarState } from './components/sidebar-menu/reducers';
import { SigninState } from './components/signin/reducers';

export interface WrState {
  readonly sidebar?: SidebarState;
  readonly signin?: SigninState;
}

type WrStore = Store<WrState>;

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: WrStore = createStore(
  persistedReducer,
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export const persistor = persistStore(store);
