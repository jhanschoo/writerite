import React from 'react';
import { Heading, Flex } from "rebass";
import LandingContent from "../components/layout/LandingContent";
import WrBrandText from "./WrBrandText";
import WrSignin from "./WrSignin";

const WrLandingContent = (props: any) => (
  <LandingContent as="article">
    <Flex
      as="header"
      css={{
        minHeight: "33vh",
      }}
      width={[1, 3/5, 3/5 ]}
      p="1em"
      justifyContent="center"
      alignItems="center"
    >
      <Heading
        as="h1"
        fontSize={[4, 6, 6]}
        textAlign="center"
      >
        Study with supercharged flashcards using <WrBrandText />.
      </Heading>
    </Flex>
    <Flex
      as="aside"
      width={[1, 2/5, 2/5 ]}
      p="1em"
      justifyContent="center"
      alignItems="center"
    >
      <WrSignin />
    </Flex>
  </LandingContent>
)

export default WrLandingContent;