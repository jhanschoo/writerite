import React from 'react';
import {
  Switch, Route, Redirect, useRouteMatch,
} from 'react-router';

import WrNavBar from '../navbar/WrNavBar';
import WrFindRoom from './search/WrFindRoom';
import WrRoomDetail from './detail/WrRoomDetail';

const WrDeckView = () => {
  const { url } = useRouteMatch();
  return (
    <>
      <WrNavBar />
      <Switch>
        <Route path={`${url}/search`} component={WrFindRoom} />
        <Route path={`${url}/:roomId`} component={WrRoomDetail} />
        <Redirect to={`${url}/search`} />
      </Switch>
    </>
  );
};

export default WrDeckView;
