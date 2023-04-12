import { Store, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./reducers";

import { SigninState } from "src/components/signin/reducers";
import { DeckDetailCardsState } from "src/components/deck/detail/reducers";

export interface WrState {
  readonly deckDetailCards?: DeckDetailCardsState;
  readonly signin?: SigninState;
}

type WrStore = Store<WrState>;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store: WrStore = createStore(
  persistedReducer,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unsafe-call
  window?.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
