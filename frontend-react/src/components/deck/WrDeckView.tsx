import React from "react";

import { Redirect, Route, Switch, useRouteMatch } from "react-router";

import WrNavBar from "../navbar/WrNavBar";
import WrDecksList from "./list/WrDecksList";
import WrDeckDetail from "./detail/WrDeckDetail";

const WrDeckView = (): JSX.Element => {
  const match = useRouteMatch();
  return (
    <>
      <WrNavBar />
      <Switch>
        <Route path={`${match.url}/list`} component={WrDecksList} />
        <Route path={`${match.url}/:deckId`} component={WrDeckDetail} />
        <Redirect to={`${match.url}/list`} />
      </Switch>
    </>
  );
};

export default WrDeckView;
