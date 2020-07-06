import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { WrState } from '../../store';
import { createSignout, SigninAction } from '../signin/actions';

import { restartWsConnection } from '../../apolloClient';
import { CurrentUser } from '../../types';

import styled from 'styled-components';
import Link from '../../ui/Link';
import { BorderlessButton } from '../../ui/Button';
import NavBar from '../../ui/navbar/NavBar';
import NavBarItem from '../../ui/navbar/NavBarItem';
import NavBarList from '../../ui/navbar/NavBarList';

import WrHamburger from './WrHamburger';
import WrBrandText from '../brand/WrBrandText';
import { Dispatch } from 'redux';

const BrandHeading = styled.h3`
margin: 0;
`;

const StyledNavBar = styled(NavBar)`
margin: 0;
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  font-size: 75%;
}
`;

const BrandNavBarItem = styled(NavBarItem)`
padding: ${({ theme }) => theme.space[2]};
`;

const NavBarListRight = styled(NavBarList)`
justify-content: flex-end;
`;

const PageLink = styled(Link)`
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
`;

const SignoutButton = styled(BorderlessButton)`
padding: ${({ theme }) => theme.space[2]};
`;

const BrandLink = styled(Link)`
padding: 0;
border: none;
background: none;

&.active, :hover {
  background: none;
  color: inherit;
}
`;

const renderLoggedOut = () => {
  return (
    <NavBarItem>
      <PageLink to="/signin" exact={true}>
        Sign in
      </PageLink>
    </NavBarItem>
  );
};

const renderLoggedIn = (user: CurrentUser, dispatchSignout: () => SigninAction) => {
  if (!user) {
    return null;
  }
  const signoutAndRestartWs = () => {
    dispatchSignout();
    createSignout();
    restartWsConnection();
  };
  return (
    <>
      <NavBarItem>
        <PageLink to="/deck">
          Decks
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <PageLink to="/room">
          Rooms
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <PageLink to="/stats">
          Stats
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <PageLink to="/user">
          Account
        </PageLink>
      </NavBarItem>
      <NavBarItem>
        <SignoutButton onClick={signoutAndRestartWs}>
          Sign out
        </SignoutButton>
      </NavBarItem>
    </>
  );
};

const WrNavBar = ()  => {
  const user = useSelector<WrState, CurrentUser | null>((state) => state?.signin?.session?.user ?? null);
  const dispatch = useDispatch<Dispatch<SigninAction>>();
  const dispatchSignout = () => dispatch(createSignout());
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
      {user ? renderLoggedIn(user, dispatchSignout) : renderLoggedOut()}
    </NavBarListRight>
  </StyledNavBar>
  );
};

export default WrNavBar;
