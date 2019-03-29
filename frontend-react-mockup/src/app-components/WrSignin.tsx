import React from 'react';
import { Box, Flex, Text } from "rebass";
import LabeledDivider from '../components/LabeledDivider';
import Button from '../components/form/Button';
import TextInput from '../components/form/TextInput';
import Fieldset from '../components/form/Fieldset';
import SmallMessage from '../components/form/SmallMessage';

const WrSignin = (props: any) => (
  <Box
    as="form"
    p={3}
    {...props}
  >
    <Button
      width="100%"
      variant="googleRed"
      my={2}
    >
      Sign in with Google
    </Button>
    <Button
      width="100%"
      variant="facebookBlue"
      my={2}
    >
      Sign in with Facebook
    </Button>
    <LabeledDivider>
      OR
    </LabeledDivider>
    <Fieldset my={1}>
      <label>Email</label>
      <TextInput
        width="100%"
        type="email"
        my={1}
      />
    </Fieldset>
    <Fieldset my={1}>
      <label>Password</label>
      <TextInput
        width="100%"
        type="password"
        my={1}
        variant="valid"
      />
    </Fieldset>
    <Fieldset my={1}>
      <label>Confirm Password</label>
      <TextInput
        width="100%"
        type="password"
        variant="error"
        my={1}
      />
      <SmallMessage color="error">This is an error message</SmallMessage>
    </Fieldset>
    <Button
      width="100%"
      variant="default"
      my={2}
    >
      Sign in with Email and Password
    </Button>
  </Box>
)

export default WrSignin;