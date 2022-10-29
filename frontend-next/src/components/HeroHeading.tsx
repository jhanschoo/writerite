import { Title } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

const HeroHeading: FC<PropsWithChildren> = ({ children }) => (
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
