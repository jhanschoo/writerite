import React, { useState, useEffect, ReactNode } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { createRegister, createDeregister, SidebarAction } from './actions';

import styled from 'styled-components';
import SidebarMenu from '../../ui/sidebar-menu/SidebarMenu';

const ResponsiveSidebarMenu = styled(SidebarMenu)`
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  position: relative;
  background: ${({ theme }) => theme.color.bg2};
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

  // tslint:disable-next-line: no-shadowed-variable
const WrSidebarMenu = ({ createRegister, createDeregister, hidden, children }: Props) => {
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
      {children}
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

const connectedWrSidebarMenu = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, mapDispatchToProps,
)(WrSidebarMenu);

export default connectedWrSidebarMenu;
