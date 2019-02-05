import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';

import { WrState } from './store';
import { createSignout, SigninAction } from './signin/actions';
import { CurrentUser } from './signin/types';
import { restartWsConnection } from './apolloClient';
import { WriteRiteMark } from './util';

interface OwnProps {
  readonly dashboardPage?: string;
}

interface DispatchProps {
  createSignout: () => SigninAction;
}

interface StateProps {
  user: CurrentUser | null;
}

type Props = StateProps & DispatchProps & OwnProps;

const renderDashboardNav = (dashboardPage?: string) => {
  return (
    <Dropdown item={true} text={dashboardPage || 'Dashboard'}>
      <Dropdown.Menu>
        <Dropdown.Item as={NavLink} to="/dashboard/deck">
          Decks
        </Dropdown.Item>
        <Dropdown.Item as={NavLink} to="/dashboard/room">
          Rooms
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

class WrNavbar extends PureComponent<Props> {
  public readonly render = () => {
    const { user, dashboardPage, children } = this.props;
    const { renderLogout } = this;
    return (
      <Menu stackable={true}>
        <Menu.Item as={Link} header={true} to="/">
          <WriteRiteMark />
        </Menu.Item>
        {user && renderDashboardNav(dashboardPage)}
        {children}
        <Menu.Menu position="right">
          {renderLogout()}
        </Menu.Menu>
      </Menu>
    );
  }

  private readonly renderLogout = () => {
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
      <Dropdown item={true} text={user.email}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={signoutAndRestartWs}>
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(WrNavbar);
