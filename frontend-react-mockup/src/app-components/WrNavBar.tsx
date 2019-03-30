import React from 'react';
import { Flex, Heading } from "rebass";
import NavLink from "../components/navbar/NavLink";

import NavBar from "../components/navbar/NavBar";
import NavBarItem from "../components/navbar/NavBarItem";
import BrandText from "./WrBrandText";
import Icon from '../components/Icon';
import NavBarList from '../components/navbar/NavBarList';

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