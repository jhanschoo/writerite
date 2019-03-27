import React from 'react';
import { Heading } from "rebass";

import NavBar from "../components/navbar/NavBar";
import NavBarItem from "../components/navbar/NavBarItem";
import BrandText from "./WrBrandText";

const WrNavBar = (props: any) => (
  <NavBar
    left={
      <>
        <NavBarItem
          pt="0.5em"
          pb="0.5em"
        >
          <Heading fontSize={2}><BrandText /></Heading>
        </NavBarItem>
      </>
    }
    right={
      <>
        <NavBarItem>
          Sign in
        </NavBarItem>
      </>
    }
  />
);

export default WrNavBar;