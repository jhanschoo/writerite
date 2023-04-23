import { PropsWithChildren } from 'react';
import { Title } from '@mantine/core';

const HeroHeading = ({ children }: PropsWithChildren) => (
  <Title
    order={1}
    align="center"
    sx={{
      fontSize: '300%',
    }}
  >
    {children}
  </Title>
);

export default HeroHeading;
