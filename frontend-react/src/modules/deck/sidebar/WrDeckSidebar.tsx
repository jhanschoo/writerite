import React, { useState, useEffect, ReactNode } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../../store';
import { createRegister, createDeregister, SidebarAction } from './actions';

import styled from 'styled-components';
import SidebarMenu from '../../../ui/sidebar-menu/SidebarMenu';

import WrManageDecks from './WrManageDecks';
import WrNewDeck from './WrNewDeck';
import WrOwnDecks from './WrOwnDecks';
import WrOthersDecks from './WrOthersDecks';

const ResponsiveSidebarMenu = styled(SidebarMenu)`
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    position: relative;
    background: ${({ theme }) => theme.colors.bg2};
    left: -100%;
    grid-area: 2 / 1 / 3 / 12;
    z-index: 50;
    transition: left 0.125s linear;

    &.unhidden {
      left: 0;
    }
  }
`;

interface DispatchProps {
  createRegister: () => SidebarAction;
  createDeregister: () => SidebarAction;
}

interface StateProps {
  hidden?: boolean;
}

interface OwnProps {
  children?: ReactNode;
}

type Props = StateProps & DispatchProps & OwnProps;

const WrDeckSidebar = (props: Props) => {
  // tslint:disable-next-line: no-shadowed-variable
  const { createRegister, createDeregister, hidden } = props;
  const [hasRegistered, setRegistered] = useState(false);
  useEffect(() => {
    setRegistered(true);
    createRegister();

    return () => {
      setRegistered(false);
      createDeregister();
    };
  }, [hasRegistered, createRegister, createDeregister]);
  return (
    <ResponsiveSidebarMenu as="nav" className={hidden ? undefined : 'unhidden'}>
      <WrManageDecks />
      <WrNewDeck />
      <WrOwnDecks />
      <WrOthersDecks />
      {props.children}
    </ResponsiveSidebarMenu>
  );
};

const mapStateToProps = (state: WrState): StateProps => {
  const hidden = state.sidebar && state.sidebar.hidden;
  return { hidden };
};

const mapDispatchToProps: DispatchProps = {
  createRegister,
  createDeregister,
};

const connectedWrDeckSidebar = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, mapDispatchToProps,
)(WrDeckSidebar);

export default connectedWrDeckSidebar;
