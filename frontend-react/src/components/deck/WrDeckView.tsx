import React from 'react';

import { Switch, Route, Redirect, useRouteMatch, } from 'react-router';

import WrNavBar from '../navbar/WrNavBar';
import WrDeckSidebar from './sidebar/WrDeckSidebar';
import WrManageOwnDecks from './own/WrManageOwnDecks';
import WrFindDecks from './find/WrFindDecks';
import WrUploadDeck from './WrUploadDeck';
import WrDeckDetail from './detail/WrDeckDetail';

const WrDeckView = () => {
  const match = useRouteMatch();
  return (
    <>
      <WrNavBar />
      <WrDeckSidebar />
      <Switch>
        <Route path={`${match.url}/own`} component={WrManageOwnDecks} />
        <Route path={`${match.url}/find`} component={WrFindDecks} />
        <Route path={`${match.url}/upload`} component={WrUploadDeck} />
        <Route path={`${match.url}/:deckId`} component={WrDeckDetail} />
        <Redirect to={`${match.url}/own`} />
      </Switch>
    </>
  );
};

export default WrDeckView;
