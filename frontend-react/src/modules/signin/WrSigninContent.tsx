import React from 'react';

import { Flex } from 'rebass';
import LandingContent from '../../ui/layout/LandingContent';

import WrSignin from './WrSignin';

const WrSigninContent = (props: any) => (
  <LandingContent as="article" {...props}>
    <Flex
      width={[1, 2 / 5, 2 / 5 ]}
      p={3}
      justifyContent="center"
      alignItems="center"
      bg="bg1"
    >
      <WrSignin />
    </Flex>
  </LandingContent>
);

export default WrSigninContent;
