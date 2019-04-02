import { combineReducers } from 'redux';
import { signin } from './modules/signin/reducers';
import { deck } from './modules/deck/reducers';
import { room } from './modules/room/reducers';
import { card } from './modules/card/reducers';

export const rootReducer = combineReducers({
  signin,
  deck,
  room,
  card,
});
