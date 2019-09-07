import { combineReducers } from 'redux';
import { sidebar } from './components/sidebar-menu/reducers';
import { signin } from './components/signin/reducers';

export const rootReducer = combineReducers({
  sidebar,
  signin,
});
