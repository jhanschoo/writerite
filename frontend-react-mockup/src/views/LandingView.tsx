import React, { Component } from 'react';
import WrNavBar from '../app-components/WrNavBar';
import WrLandingContent from '../app-components/WrLandingContent';

class LandingView extends Component {
  render() {
    return (
      <>
        <WrNavBar />
        <WrLandingContent />
      </>
    );
  }
}

export default LandingView;
