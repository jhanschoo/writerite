import React from 'react';
import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import { connect } from 'react-redux';
import { WrState } from './store';
import { CurrentUser } from './modules/signin/types';

import LandingView from './modules/landing/LandingView';
import ViewportContainer from './ui/layout/ViewportContainer';

interface StateProps {
  user: CurrentUser | null;
}

type Props = StateProps & RouteComponentProps;

// tslint:disable-next-line: variable-name
const App = (props: Props) => {
  const { user } = props;
  return (
    <ViewportContainer bg="bg1">
      <Switch>
        <Route path="/" exact={true} component={LandingView} />
        {/* {user && <Route path="/dashboard" component={DashboardView} />} */}
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
