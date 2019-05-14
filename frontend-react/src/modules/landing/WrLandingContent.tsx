import React from 'react';

import styled from 'styled-components';
import { Flex } from 'rebass';
import LandingContent from '../../ui/layout/LandingContent';

import WrBrandText from '../brand/WrBrandText';
import WrSignin from '../signin/WrSignin';

const HeroHeading = styled.h1`
  font-size: 300%;
  text-align: center;

  @media (max-width: ${(props) => props.theme.breakpoints[0]}) {
    font-size: 150%;
  }
`;

const Article = styled.article`
  display: flex;
  flex-wrap: wrap;
`;

const WrLandingContent = () => (
  <LandingContent>
    <Article>
      <Flex
        as="header"
        css={{ minHeight: '33vh' }}
        width={[1, 1, 3 / 5 ]}
        p={4}
        justifyContent="center"
        alignItems="center"
      >
        <HeroHeading>
          <em>Study with supercharged flashcards on </em><WrBrandText suffix="." />
        </HeroHeading>
      </Flex>
      <Flex
        as="aside"
        width={[1, 1, 2 / 5 ]}
        p={3}
        justifyContent="center"
        alignItems="center"
        bg="bg1"
      >
        <WrSignin />
      </Flex>
    </Article>
  </LandingContent>
);

export default WrLandingContent;
