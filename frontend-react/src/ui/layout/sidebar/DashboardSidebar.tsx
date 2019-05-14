import React, { Component, ReactType } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../../store';
import { createRegister, createDeregister, SidebarAction } from './actions';

import styled from 'styled-components';
import { Flex, FlexProps } from 'rebass';

interface DispatchProps {
  createRegister: () => SidebarAction;
  createDeregister: () => SidebarAction;
}

interface StateProps {
  hidden?: boolean;
}

interface OwnProps extends FlexProps {
  wrAs?: ReactType;
}

type Props = StateProps & DispatchProps & OwnProps;

class DashboardSidebar extends Component<Props> {
  // TODO: implement state to toggle hidden
  public readonly componentDidMount = () => {
    this.props.createRegister();
  }

  public readonly componentWillUnmount = () => {
    this.props.createDeregister();
  }

  public readonly render = () => {
    const { hidden, className, createRegister: _0, createDeregister: _1, wrAs, as, ...filteredProps } = this.props;
    const newClassName = (hidden) ? className : className + ' unhidden';
    return (<Flex className={newClassName} as={wrAs} {...filteredProps} />);
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const hidden = state.sidebar && state.sidebar.hidden;
  return { hidden };
};

const mapDispatchToProps: DispatchProps = {
  createRegister,
  createDeregister,
};

const connectedDashboardSidebar = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, mapDispatchToProps,
)(DashboardSidebar);

const styledDashboardSidebar = styled(connectedDashboardSidebar)`
  grid-area: 2 / 2 / 3 / 5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

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

export default styledDashboardSidebar;
