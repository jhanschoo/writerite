import { combineReducers } from 'redux';
import { signin } from './signin/reducers';
import { deck } from './deck/reducers';
import { room } from './room/reducers';
import { card } from './card/reducers';

export const rootReducer = combineReducers({
  signin,
  deck,
  room,
  card,
});
