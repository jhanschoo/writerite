import React from 'react';
import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import WrNavBar from '../navbar/WrNavBar';
import WrFindRoom from './search/WrFindRoom';
import WrRoomDetail from './detail/WrRoomDetail';

const WrDeckView = ({ match: { url } }: RouteComponentProps) => {
  return (
    <>
      <WrNavBar />
      <Switch>
        {/* <Route path={`${match.url}/search`} component={WrFindRoom} /> */}
        <Route path={`${url}/search`} component={WrFindRoom} />
        <Route path={`${url}/:roomId`} component={WrRoomDetail} />
        <Redirect to={`${url}/search`} />
      </Switch>
    </>
  );
};

export default withRouter(WrDeckView);
