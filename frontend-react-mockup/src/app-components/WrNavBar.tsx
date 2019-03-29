import React from 'react';
import { Heading } from "rebass";

import NavBar from "../components/navbar/NavBar";
import NavBarItem from "../components/navbar/NavBarItem";
import BrandText from "./WrBrandText";

const WrNavBar = (props: any) => (
  <NavBar
    leftItems={
      <>
        <NavBarItem
          pt="0.5em"
          pb="0.5em"
        >
          <Heading fontSize={2}><BrandText /></Heading>
        </NavBarItem>
      </>
    }
    rightItems={
      <>
        <NavBarItem>
          Sign in
        </NavBarItem>
      </>
    }
    {...props}
  />
);

export default WrNavBar;