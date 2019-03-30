import React, { Component } from 'react';
import WrNavBar from '../app-components/WrNavBar';
import DashboardMain from '../components/layout/DashboardMain';
import WrDecksList from '../app-components/WrDecksList';

class LandingView extends Component {
  render() {
    return (
      <>
        <WrNavBar />
        <WrDecksList />
        <DashboardMain />
      </>
    );
  }
}

export default LandingView;
