import React, { MouseEvent } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { initialState } from '../../ui/layout/sidebar/reducers';

import { Menu } from 'react-feather';

import styled from 'styled-components';
import { createShow, createHide, SidebarAction } from '../../ui/layout/sidebar/actions';
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
  padding: ${({ theme }) => theme.space[2]};
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    display: flex;
    &.hidden {
      display: none;
    }
  }
`;

const WrHamburger = (props: Props) => {
  // tslint:disable-next-line: no-shadowed-variable
  const { num, hidden, createShow, createHide } = props;
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (hidden) {
      createShow();
    } else {
      createHide();
    }
  };
  const className = (num === 0) ? 'hidden' : undefined;
  return (
    <HideableNavBarItem className={className}>
      <Button variant="link" px={0} py={0} m={0} onClick={handleClick}>
        <Menu />
      </Button>
    </HideableNavBarItem>
  );
};

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
