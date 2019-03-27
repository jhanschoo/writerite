import React, { Component } from 'react';
import styled from 'styled-components';
import logo from './logo.svg';
import { Flex, Box } from 'rebass';
import WrNavBar from './app-components/WrNavBar';
import WrLandingContent from './app-components/WrLandingContent';
import ViewportContainer from './components/layout/ViewportContainer';

class App extends Component {
  render() {
    return (
      <ViewportContainer>
        <WrNavBar />
        <WrLandingContent />
      </ViewportContainer>
    );
  }
}

export default App;
