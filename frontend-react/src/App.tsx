import React, { FC } from 'react';
import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import { connect } from 'react-redux';
import { WrState } from './store';
import { IWrUserStub } from './models/WrUserStub';

import WrLandingView from './modules/landing/WrLandingView';
import WrSigninView from './modules/signin/WrSigninView';
import WrDeckView from './modules/deck/WrDeckView';
import WrRoomView from './modules/room/WrRoomView';
import ViewportContainer from './ui/layout/ViewportContainer';

interface StateProps {
  user: IWrUserStub | null;
}

type Props = StateProps & RouteComponentProps;

// tslint:disable-next-line: variable-name
const App: FC<StateProps & RouteComponentProps> = (props: Props) => {
  const { user } = props;
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
export default withRouter<RouteComponentProps>(
  connect<
    StateProps, {}, RouteComponentProps
  >(mapStateToProps)(App),
);
