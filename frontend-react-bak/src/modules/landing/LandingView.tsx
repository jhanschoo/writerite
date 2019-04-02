import React, { Component } from 'react';
import WrNavBar from '../navbar/WrNavBar';
import WrLandingContent from './WrLandingContent';

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
