import React, { useState, useEffect, ReactNode } from 'react';

import { connect, useDispatch } from 'react-redux';
import { WrState } from '../../store';
import { createRegister, createDeregister, SidebarAction } from './actions';

import styled from 'styled-components';
import SidebarMenu from '../../ui/sidebar-menu/SidebarMenu';
import { Dispatch } from 'redux';

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
const WrSidebarMenu = ({ hidden, children }: Props) => {
  const dispatch = useDispatch<Dispatch<SidebarAction>>();
  const [hasRegistered, setRegistered] = useState(false);
  useEffect(() => {
    setRegistered(true);
    dispatch(createRegister());

    return () => {
      setRegistered(false);
      dispatch(createDeregister());
    };
  }, [hasRegistered, dispatch]);
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
