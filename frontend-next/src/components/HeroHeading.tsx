import { Title } from '@mantine/core';
import { FC } from 'react';

const HeroHeading: FC = ({ children }) =>
  <Title
    order={1}
    align="center"
    sx={{
      fontSize: '300%',
    }}
  >
    {children}
  </Title>;

export default HeroHeading;
