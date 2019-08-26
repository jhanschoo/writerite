import React from 'react';

import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import WrNavBar from '../navbar/WrNavBar';
import WrDeckSidebar from './sidebar/WrDeckSidebar';
import WrOrganizeDecks from './organize/WrOrganizeDecks';
import WrFindDecks from './find/WrFindDecks';
import WrUploadDeck from './WrUploadDeck';
import WrDeckDetail from './detail/WrDeckDetail';

const WrDeckView = (props: RouteComponentProps) => {
  const { match } = props;
  return (
    <>
      <WrNavBar />
      <WrDeckSidebar />
      <Switch>
        <Route path={`${match.url}/organize`} component={WrOrganizeDecks} />
        <Route path={`${match.url}/search`} component={WrFindDecks} />
        <Route path={`${match.url}/upload`} component={WrUploadDeck} />
        <Route path={`${match.url}/:deckId`} component={WrDeckDetail} />
        <Redirect to={`${match.url}/organize`} />
      </Switch>
    </>
  );
};

export default withRouter(WrDeckView);
