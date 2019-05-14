import React, { MouseEvent } from 'react';

import { connect } from 'react-redux';
import { WrState } from '../../store';
import { initialState } from '../deck/sidebar/reducers';

import { Menu } from 'react-feather';

import styled from 'styled-components';
import { createShow, createHide, SidebarAction } from '../deck/sidebar/actions';
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

const StyledButton = styled(Button)`
  padding: 0;
  margin: 0;
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
      <StyledButton variant="link" onClick={handleClick}>
        <Menu />
      </StyledButton>
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
