import { combineReducers } from 'redux';
import { sidebar } from './modules/deck/sidebar/reducers';
import { signin } from './modules/signin/reducers';
import { deck } from './modules/deck/reducers';
import { room } from './modules/room/reducers';
import { card } from './modules/card/reducers';

export const rootReducer = combineReducers({
  sidebar,
  signin,
  deck,
  room,
  card,
});
