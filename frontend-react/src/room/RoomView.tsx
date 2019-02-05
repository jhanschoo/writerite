import React, { PureComponent } from 'react';

import {
  Switch, Route, withRouter, RouteComponentProps,
} from 'react-router';
import WrRoomList from './WrRoomList';
import WrRoomDetail from './WrRoomDetail';

class RoomView extends PureComponent<RouteComponentProps> {
  public readonly render = () => {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}`} exact={true} component={WrRoomList} />
        <Route path={`${match.url}/:roomId`} component={WrRoomDetail} />
      </Switch>
    );
  }
}

export default withRouter<RouteComponentProps>(RoomView);
