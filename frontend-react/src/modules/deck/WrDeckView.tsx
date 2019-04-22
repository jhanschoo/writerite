import React from 'react';
import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import WrNavBar from '../navbar/WrNavBar';
import WrDeckSidebar from './sidebar/WrDeckSidebar';
import WrFindDeck from './finder/WrFindDeck';
import WrDeckDetail from './detail/WrDeckDetail';

const WrDeckView = (props: RouteComponentProps) => {
  const { match } = props;
  return (
    <>
      <WrNavBar />
      <WrDeckSidebar />
      <Switch>
        <Route path={`${match.url}/manage`} component={WrFindDeck} />
        <Route path={`${match.url}/search`} component={WrFindDeck} />
        <Route path={`${match.url}/:deckId`} component={WrDeckDetail} />
        <Redirect to={`${match.url}/manage`} />
      </Switch>
    </>
  );
};

export default withRouter<RouteComponentProps>(WrDeckView);
