import React from 'react';
import {
  Switch, Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router';

import WrNavBar from '../navbar/WrNavBar';
import WrFindRoom from './search/WrFindRoom';
import WrRoomDetail from './detail/WrRoomDetail';

const WrDeckView = (props: RouteComponentProps) => {
  const { match } = props;
  return (
    <>
      <WrNavBar />
      <Switch>
        {/* <Route path={`${match.url}/search`} component={WrFindRoom} /> */}
        <Route path={`${match.url}/search`} component={WrFindRoom} />
        <Route path={`${match.url}/:roomId`} component={WrRoomDetail} />
        <Redirect to={`${match.url}/search`} />
      </Switch>
    </>
  );
};

export default withRouter(WrDeckView);
