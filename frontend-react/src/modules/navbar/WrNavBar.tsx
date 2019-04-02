import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Heading } from 'rebass';
import NavLink from '../../ui/navbar/NavLink';

import NavBar from '../../ui/navbar/NavBar';
import NavBarItem from '../../ui/navbar/NavBarItem';
import BrandText from '../brand/WrBrandText';
import Icon from '../../ui/Icon';
import NavBarList from '../../ui/navbar/NavBarList';

import { WrState } from '../../store';
import { createSignout, SigninAction } from '../signin/actions';
import { CurrentUser } from '../signin/types';
import { restartWsConnection } from '../../apolloClient';

interface DispatchProps {
  createSignout: () => SigninAction;
}

interface StateProps {
  user: CurrentUser | null;
}

type Props = StateProps & DispatchProps;

class WrNavBar extends PureComponent<Props> {
  public readonly render = () => {
    // const { user, dashboardPage, children } = this.props;
    const { renderLoggedIn, renderLoggedOut } = this;
    return (
    <NavBar {...this.props}>
      <NavBarList>
        <NavBarItem
          py={2}
        >
          <NavLink to="/" activeClassName="">
            <Heading fontSize={2}><BrandText /></Heading>
          </NavLink>
        </NavBarItem>
      </NavBarList>
      <NavBarList justifyContent="flex-end">
        {renderLoggedIn() || renderLoggedOut()}
      </NavBarList>
    </NavBar>
    );
  }

  private readonly renderLoggedIn = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { createSignout, user } = this.props;
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
          <NavLink to="/decks">
            <Icon icon="layers" />
            Decks
          </NavLink>
        </NavBarItem>
        <NavBarItem>
          <NavLink to="/rooms">
            <Icon icon="message-circle" />
            Rooms
          </NavLink>
        </NavBarItem>
        <NavBarItem>
          <NavLink to="/stats">
            <Icon icon="activity" />
            Stats
          </NavLink>
        </NavBarItem>
        <NavBarItem>
          <NavLink as="a" onClick={signoutAndRestartWs}>
            <Icon icon="feather" />
            Sign out
          </NavLink>
        </NavBarItem>
      </>
    );
  }

  private readonly renderLoggedOut = () => (
    <NavBarItem>
      <NavLink to="/signin" exact={true}>
        <Icon icon="feather" />
        Sign in
      </NavLink>
    </NavBarItem>
  )
}

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

const mapDispatchToProps: DispatchProps = {
  createSignout,
};

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(WrNavBar);
