import React, { MouseEvent } from 'react';
import { Menu } from 'react-feather';

import type { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import type { WrState } from '../../store';
import { initialState } from '../sidebar-menu/reducers';
import { createShow, createHide, SidebarAction } from '../sidebar-menu/actions';

import styled from 'styled-components';
import { BorderlessButton } from '../../ui/Button';
import NavBarItem from '../../ui/navbar/NavBarItem';

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

const WrHamburger = () => {
  const { num, hidden } = useSelector<WrState, { num?: number, hidden?: boolean }>((state) => state.sidebar ?? initialState);
  const dispatch = useDispatch<Dispatch<SidebarAction>>();
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (hidden) {
      dispatch(createShow());
    } else {
      dispatch(createHide());
    }
  };
  const className = (num === 0) ? 'hidden' : undefined;
  return (
    <HideableNavBarItem className={className}>
      <BorderlessButton onClick={handleClick}>
        <Menu />
      </BorderlessButton>
    </HideableNavBarItem>
  );
};

export default WrHamburger;
