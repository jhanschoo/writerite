import React from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { createSignout, SigninAction } from '../signin/actions';

import { restartWsConnection } from '../../apolloClient';
import { WrUserStub } from '../../client-models/gqlTypes/WrUserStub';

import styled from 'styled-components';
import Link from '../../ui/Link';
import { BorderlessButton } from '../../ui/Button';
import NavBar from '../../ui/navbar/NavBar';
import NavBarItem from '../../ui/navbar/NavBarItem';
import NavBarList from '../../ui/navbar/NavBarList';

import WrHamburger from './WrHamburger';
import WrBrandText from '../brand/WrBrandText';

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

interface DispatchProps {
  createSignout: () => SigninAction;
}

interface StateProps {
  user: WrUserStub | null;
}

type Props = StateProps & DispatchProps;

// tslint:disable-next-line: no-shadowed-variable
const renderLoggedIn = ({ createSignout, user }: Props) => {
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
        <SignoutButton onClick={signoutAndRestartWs}>
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
