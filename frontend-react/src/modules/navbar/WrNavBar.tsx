import React from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { createSignout, SigninAction } from '../signin/actions';
import { CurrentUser } from '../signin/types';

import { restartWsConnection } from '../../apolloClient';

import { Layers, MessageCircle, Activity, Feather } from 'react-feather';

import styled from 'styled-components';
import { breakpoints } from '../../theme';
import Link from '../../ui/Link';
import Button from '../../ui/form/Button';
import NavBar from '../../ui/navbar/NavBar';
import NavBarItem from '../../ui/navbar/NavBarItem';
import NavBarList from '../../ui/navbar/NavBarList';

import WrHamburger from './WrHamburger';
import WrBrandText from '../brand/WrBrandText';

const BrandHeading = styled.h3`
  margin: 0;
`;

interface DispatchProps {
  createSignout: () => SigninAction;
}

interface StateProps {
  user: CurrentUser | null;
}

type Props = StateProps & DispatchProps;

const renderLoggedOut = () => {
  const mq = window.matchMedia(`(max-width: ${breakpoints[1]})`);
  return (
    <NavBarItem>
      <Link to="/signin" exact={true} p={[0, 1, 2]}>
        <Feather size={mq.matches ? 18 : 24} />
        Sign in
      </Link>
    </NavBarItem>
  );
};

const renderLoggedIn = (props: Props) => {
  // tslint:disable-next-line: no-shadowed-variable
  const { createSignout, user } = props;
  const mq = window.matchMedia(`(max-width: ${breakpoints[1]})`);
  if (!user) {
    return null;
  }
  const signoutAndRestartWs = () => {
    createSignout();
    restartWsConnection();
  };
  return (
    <>
      <NavBarItem>
        <Link to="/deck" p={[0, 1, 2]}>
          <Layers size={mq.matches ? 18 : 24} />
          Decks
        </Link>
      </NavBarItem>
      <NavBarItem>
        <Link to="/room" p={[0, 1, 2]}>
          <MessageCircle size={mq.matches ? 18 : 24} />
          Rooms
        </Link>
      </NavBarItem>
      <NavBarItem>
        <Link to="/stats" p={[0, 1, 2]}>
          <Activity size={mq.matches ? 18 : 24} />
          Stats
        </Link>
      </NavBarItem>
      <NavBarItem>
        <Button variant="link" onClick={signoutAndRestartWs} p={[0, 1, 2]}>
          <Feather size={mq.matches ? 18 : 24} />
          Sign out
        </Button>
      </NavBarItem>
    </>
  );
};

const WrNavBar = (props: Props)  => {
  // const { user, dashboardPage, children } = this.props;
  return (
  <NavBar {...props} fontSize={['75%', '75%', '100%']}>
    <NavBarList>
      <WrHamburger />
      <NavBarItem
        py={2}
      >
        <Link to="/" activeClassName="" p={0}>
          <BrandHeading>
            <WrBrandText responsive={true} />
          </BrandHeading>
        </Link>
      </NavBarItem>
    </NavBarList>
    <NavBarList justifyContent="flex-end">
      {renderLoggedIn(props) || renderLoggedOut()}
    </NavBarList>
  </NavBar>
  );
};

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

const mapDispatchToProps: DispatchProps = {
  createSignout,
};

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(WrNavBar);
