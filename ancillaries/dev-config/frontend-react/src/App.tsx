import React from "react";
import { Redirect, Route, Switch } from "react-router";

import { useSelector } from "react-redux";
import { WrState } from "./store";

import { ViewportContainer } from "./ui";

import type { CurrentUser } from "./types";
import WrDeckView from "./components/deck/WrDeckView";
import WrLandingView from "./components/landing/WrLandingView";
import WrRoomView from "./components/room/WrRoomView";
import WrSigninView from "./components/signin/WrSigninView";

const App = (): JSX.Element => {
  const user = useSelector<WrState, CurrentUser | null>(
    (state) => state.signin?.session?.user ?? null
  );
  return (
    <ViewportContainer>
      <Switch>
        <Route path="/" exact={true} component={WrLandingView} />
        {user && <Route path="/deck" component={WrDeckView} />}
        {user && <Route path="/room" component={WrRoomView} />}
        <Route path="/signin" exact={true} component={WrSigninView} />
        <Redirect to="/" />
      </Switch>
    </ViewportContainer>
  );
};

export default App;
