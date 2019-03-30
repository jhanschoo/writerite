import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ViewportContainer from './components/layout/ViewportContainer';
import LandingView from './views/LandingView';
import DecksView from './views/DecksView';

class App extends Component {
  render() {
    return (
      <ViewportContainer bg="bg1">
        <Switch>
          <Route exact path="/" component={LandingView} />
          <Route exact path="/decks" component={DecksView} />
        </Switch>
      </ViewportContainer>
    );
  }
}

export default App;
