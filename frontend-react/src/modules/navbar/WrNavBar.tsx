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

const StyledNavBar = styled(NavBar)`
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    font-size: 75%;
  }
`;

const BrandNavBarItem = styled(NavBarItem)`
  padding: ${({ theme }) => theme.space[2]}
`;

const NavBarListRight = styled(NavBarList)`
  justify-content: flex-end;
`;

const PageLink = styled(Link)`
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    padding: ${({ theme }) => theme.space[1]};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: ${({ theme }) => theme.space[0]};
  }
`;

const SignoutButton = styled(Button)`
  padding: ${({ theme }) => theme.space[2]};
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    padding: ${({ theme }) => theme.space[1]};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: ${({ theme }) => theme.space[0]};
  }
`;

const BrandLink = styled(Link)`
  padding: 0;
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
      <PageLink to="/signin" exact={true}>
        <Feather size={mq.matches ? 18 : 24} />
        Sign in
      </PageLink>
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
        <PageLink to="/deck">
          <Layers size={mq.matches ? 18 : 24} />
          Decks
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <PageLink to="/room">
          <MessageCircle size={mq.matches ? 18 : 24} />
          Rooms
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <PageLink to="/stats">
          <Activity size={mq.matches ? 18 : 24} />
          Stats
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <SignoutButton variant="link" onClick={signoutAndRestartWs}>
          <Feather size={mq.matches ? 18 : 24} />
          Sign out
        </SignoutButton>
      </NavBarItem>
    </>
  );
};

const WrNavBar = (props: Props)  => {
  return (
  <StyledNavBar>
    <NavBarList>
      <WrHamburger />
      <BrandNavBarItem>
        <BrandLink to="/" activeClassName="">
          <BrandHeading>
            <WrBrandText short={true} />
          </BrandHeading>
        </BrandLink>
      </BrandNavBarItem>
    </NavBarList>
    <NavBarListRight>
      {renderLoggedIn(props) || renderLoggedOut()}
    </NavBarListRight>
  </StyledNavBar>
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
