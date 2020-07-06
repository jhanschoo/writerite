import React from 'react';
import {
  Switch, Route, Redirect, /*withRouter, RouteComponentProps,*/
} from 'react-router';

import { useSelector } from 'react-redux';
import { WrState } from './store';

import { CurrentUser } from './types';

import WrLandingView from './components/landing/WrLandingView';
import WrUserView from './components/user/WrUserView';
import WrSigninView from './components/signin/WrSigninView';
import WrDeckView from './components/deck/WrDeckView';
// import WrRoomView from './components/room/WrRoomView';
import ViewportContainer from './ui/layout/ViewportContainer';

const App = () => {
  const user = useSelector<WrState, CurrentUser | null>((state) => state.signin?.session?.user ?? null)
  return (
    <ViewportContainer>
      <Switch>
        <Route path="/" exact={true} component={WrLandingView} />
        {user && <Route path="/user" component={WrUserView} />}
        {user && <Route path="/deck" component={WrDeckView} />}
        {/* {user && <Route path="/room" component={WrRoomView} />} */}
        <Route path="/signin" exact={true} component={WrSigninView} />
        <Redirect to="/" />
      </Switch>
    </ViewportContainer>
  );
};

// withRouter decorator necessary for routing to work properly.
// see: https://stackoverflow.com/questions/46036809
// export default withRouter(
//   connect<
//     StateProps, {}, RouteComponentProps
//   >(mapStateToProps)(App),
// );
export default App;