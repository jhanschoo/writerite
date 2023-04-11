import { combineReducers } from "redux";

import { deckDetailCards } from "./components/deck/detail/reducers";
import { signin } from "./components/signin/reducers";

export const rootReducer = combineReducers({
  deckDetailCards,
  signin,
});
