import React, { PureComponent, MouseEvent } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { initialState } from '../../ui/layout/sidebar/reducers';

import { Menu } from 'react-feather';

import { createShow, createHide, SidebarAction } from '../../ui/layout/sidebar/actions';
import { breakpoints } from '../../theme';
import Button from '../../ui/form/Button';
import NavBarItem from '../../ui/navbar/NavBarItem';

interface DispatchProps {
  createShow: () => SidebarAction;
  createHide: () => SidebarAction;
}

interface StateProps {
  num?: number;
  hidden?: boolean;
}

type Props = StateProps & DispatchProps;

const HideableNavBarItem = styled(NavBarItem)`
  &.hidden {
    display: none;
  }
`;

class WrHamburger extends PureComponent<Props> {
  public readonly render = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { num, hidden, createShow, createHide } = this.props;
    const mq = window.matchMedia(`(max-width: ${breakpoints[1]})`);
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (hidden) {
        createShow();
      } else {
        createHide();
      }
    };
    const className = (num === 0 || !mq.matches) ? 'hidden' : undefined;
    return (
      <HideableNavBarItem
        className={className}
        p={[2, 2, 2]}
      >
        <Button variant="link" px={0} py={0} m={0} onClick={handleClick}>
          <Menu />
        </Button>
      </HideableNavBarItem>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const { num, hidden } = state.sidebar || initialState;
  return { num, hidden };
};

const mapDispatchToProps: DispatchProps = {
  createShow,
  createHide,
};

const connectedWrHamburger = connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(WrHamburger);

export default connectedWrHamburger;
