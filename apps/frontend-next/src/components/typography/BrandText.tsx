import { PropsWithChildren } from 'react';
import { Text } from '@mantine/core';

interface Props {
  full?: boolean;
  prefix?: string;
  suffix?: string;
}

const BrandText = ({ prefix, full, suffix }: PropsWithChildren<Props>) => (
  <Text
    component="span"
    sx={{
      fontWeight: 400,
      fontSize: '125%',
      fontFamily: 'Yeseva One, serif',
    }}
  >
    {prefix}
    {full ? 'WriteRite' : 'Wr'}
    {suffix}
  </Text>
);

export default BrandText;
