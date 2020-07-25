import { combineReducers } from "redux";
import { signin } from "./components/signin/reducers";

export const rootReducer = combineReducers({
  signin,
});
