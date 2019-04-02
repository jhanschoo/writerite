import React from 'react';
import { Flex, Heading } from "rebass";
import NavLink from "../../ui/navbar/NavLink";

import NavBar from "../../ui/navbar/NavBar";
import NavBarItem from "../../ui/navbar/NavBarItem";
import BrandText from "../brand/WrBrandText";
import Icon from '../../ui/Icon';
import NavBarList from '../../ui/navbar/NavBarList';

const MyFlex: React.FunctionComponent<any> = Flex;

const WrNavBar = (props: any) => (
  <NavBar {...props}>
    <NavBarList>
      <NavBarItem
        py={2}
      >
        <Heading fontSize={2}><BrandText /></Heading>
      </NavBarItem>
    </NavBarList>
    <NavBarList justifyContent="flex-end">
      <NavBarItem>
        <NavLink to="/decks">
          <Icon icon="layers" />
          Decks
        </NavLink>
      </NavBarItem>
      <NavBarItem>
        <NavLink to="/rooms">
          <Icon icon="message-circle" />
          Rooms
        </NavLink>
      </NavBarItem>
      <NavBarItem>
        <NavLink to="/stats">
          <Icon icon="activity" />
          Stats
        </NavLink>
      </NavBarItem>
      <NavBarItem>
        <NavLink to="/signin">
          <Icon icon="feather" />
          Sign in
        </NavLink>
      </NavBarItem>
    </NavBarList>
  </NavBar>
);

export default WrNavBar;