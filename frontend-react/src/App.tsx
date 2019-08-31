import React from 'react';
import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import { connect } from 'react-redux';
import { WrState } from './store';

import { WrUserStub } from './client-models/gqlTypes/WrUserStub';

import WrLandingView from './components/landing/WrLandingView';
import WrSigninView from './components/signin/WrSigninView';
import WrDeckView from './components/deck/WrDeckView';
import WrRoomView from './components/room/WrRoomView';
import ViewportContainer from './ui/layout/ViewportContainer';

interface StateProps {
  user: WrUserStub | null;
}

type Props = StateProps & RouteComponentProps;

// tslint:disable-next-line: variable-name
const App = ({ user }: Props) => {
  return (
    <ViewportContainer>
      <Switch>
        <Route path="/" exact={true} component={WrLandingView} />
        {user && <Route path="/deck" component={WrDeckView} />}
        {user && <Route path="/room" component={WrRoomView} />}
        <Route path="/signin" exact={true} component={WrSigninView} />
        <Redirect to="/"/>
      </Switch>
    </ViewportContainer>
  );
};

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

// withRouter decorator necessary for routing to work properly.
// see: https://stackoverflow.com/questions/46036809
export default withRouter(
  connect<
    StateProps, {}, RouteComponentProps
  >(mapStateToProps)(App),
);
