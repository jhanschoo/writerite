import { combineReducers } from 'redux';
import { sidebar } from './components/sidebar-menu/reducers';
import { signin } from './components/signin/reducers';
import { deck } from './components/deck/reducers';
import { room } from './components/room/reducers';
import { card } from './components/card/reducers';

export const rootReducer = combineReducers({
  sidebar,
  signin,
  deck,
  room,
  card,
});
