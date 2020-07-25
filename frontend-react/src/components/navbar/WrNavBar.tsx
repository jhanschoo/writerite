import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { WrState } from "../../store";
import { SigninAction, createSignout } from "../signin/actions";

import { restartWsConnection } from "../../apolloClient";
import { CurrentUser } from "../../types";

import { wrStyled } from "../../theme";
import Link from "../../ui/Link";
import { BorderlessButton } from "../../ui/Button";
import NavBar from "../../ui/navbar/NavBar";
import NavBarItem from "../../ui/navbar/NavBarItem";
import NavBarList from "../../ui/navbar/NavBarList";

import WrBrandText from "../brand/WrBrandText";
import { Dispatch } from "redux";

const BrandHeading = wrStyled.h3`
margin: 0;
`;

const StyledNavBar = wrStyled(NavBar)`
margin: 0;
flex-wrap: nowrap;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  font-size: 75%;
}
`;

const BrandNavBarItem = wrStyled(NavBarItem)`
padding: ${({ theme: { space } }) => space[2]};
`;

const NavBarListRight = wrStyled(NavBarList)`
justify-content: flex-end;
`;

const PageLink = wrStyled(Link)`
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
}
`;

const SignoutButton = wrStyled(BorderlessButton)`
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
}
`;

const BrandLink = wrStyled(Link)`
padding: 0;
border: none;
background: none;

&.active, :hover {
  background: none;
  color: inherit;
}
`;

const renderLoggedOut = () =>
  <NavBarItem>
    <PageLink to="/signin" exact={true}>
        Sign in
    </PageLink>
  </NavBarItem>;
const renderLoggedIn = (dispatchSignout: () => SigninAction) => {
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

const WrNavBar = (): JSX.Element => {
  const user = useSelector<WrState, CurrentUser | null>((state) => state.signin?.session?.user ?? null);
  const dispatch = useDispatch<Dispatch<SigninAction>>();
  const dispatchSignout = () => dispatch(createSignout());
  return (
    <StyledNavBar>
      <NavBarList>
        <BrandNavBarItem>
          <BrandLink to="/" activeClassName="">
            <BrandHeading>
              <WrBrandText short={true} />
            </BrandHeading>
          </BrandLink>
        </BrandNavBarItem>
      </NavBarList>
      <NavBarListRight>
        {user ? renderLoggedIn(dispatchSignout) : renderLoggedOut()}
      </NavBarListRight>
    </StyledNavBar>
  );
};

export default WrNavBar;
