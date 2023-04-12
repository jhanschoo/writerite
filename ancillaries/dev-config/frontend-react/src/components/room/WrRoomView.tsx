import React from "react";

import { Redirect, Route, Switch, useRouteMatch } from "react-router";

import WrRoomDetail from "./detail/WrRoomDetail";

const WrRoomView = (): JSX.Element => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.url}/:roomId`} component={WrRoomDetail} />
      <Redirect to={"/"} />
    </Switch>
  );
};

export default WrRoomView;
