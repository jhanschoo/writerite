import React, { Component } from 'react';
import WrNavBar from './app-components/WrNavBar';
import WrLandingContent from './app-components/WrLandingContent';
import ViewportContainer from './components/layout/ViewportContainer';

class App extends Component {
  render() {
    return (
      <ViewportContainer bg="bg1">
        <WrNavBar />
        <WrLandingContent />
      </ViewportContainer>
    );
  }
}

export default App;
