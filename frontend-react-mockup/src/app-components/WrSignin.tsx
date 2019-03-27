import React from 'react';
import { Button, Box, Flex, Text } from "rebass";
import LabeledDivider from '../components/LabeledDivider';

const WrSignin = (props: any) => (
  <Box
    as="form"
    p="1em"
  >
    <Button
      width="100%"
      variant="googleRed"
      mb="0.5em"
    >
      Sign in with Google
    </Button>
    <Button
      width="100%"
      variant="facebookBlue"
      mb="0.5em"
    >
      Sign in with Facebook
    </Button>
    <LabeledDivider>
      OR
    </LabeledDivider>
    <p>Heyyo TODO: form controls here</p>
    <Button
      width="100%"
      variant="default"
      mb="0.5em"
    >
      Sign in with Email and Password
    </Button>
  </Box>
)

export default WrSignin;