import React from 'react';
import { Text } from 'rebass';

const BrandText = (props: any) => (
  <Text
    as="span"
    fontWeight="bold"
    fontFamily="brand"
    fontSize="150%"
    {...props}
  >
    WriteRite
  </Text>
);

export default BrandText;
