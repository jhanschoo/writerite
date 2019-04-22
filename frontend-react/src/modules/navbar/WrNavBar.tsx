import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { createSignout, SigninAction } from '../signin/actions';
import { CurrentUser } from '../signin/types';

import { restartWsConnection } from '../../apolloClient';

import { Layers, MessageCircle, Activity, Feather } from 'react-feather';

import { Heading } from 'rebass';
import { breakpoints } from '../../theme';
import Link from '../../ui/Link';
import NavBar from '../../ui/navbar/NavBar';
import NavBarItem from '../../ui/navbar/NavBarItem';
import NavBarList from '../../ui/navbar/NavBarList';

import WrHamburger from './WrHamburger';
import WrBrandText from '../brand/WrBrandText';

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
    <NavBar {...this.props} fontSize={['75%', '75%', '100%']}>
      <NavBarList>
        <WrHamburger />
        <NavBarItem
          py={2}
        >
          <Link to="/" activeClassName="" p={0}>
            <WrBrandText as={Heading} responsive={true} />
          </Link>
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
          <Link as="a" onClick={signoutAndRestartWs} p={[0, 1, 2]}>
            <Feather size={mq.matches ? 18 : 24} />
            Sign out
          </Link>
        </NavBarItem>
      </>
    );
  }

  private readonly renderLoggedOut = () => {
    const mq = window.matchMedia(`(max-width: ${breakpoints[1]})`);
    return (
      <NavBarItem>
        <Link to="/signin" exact={true} p={[0, 1, 2]}>
          <Feather size={mq.matches ? 18 : 24} />
          Sign in
        </Link>
      </NavBarItem>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const user = (state.signin && state.signin.data && state.signin.data.user) || null;
  return { user };
};

const mapDispatchToProps: DispatchProps = {
  createSignout,
};

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(WrNavBar);
