import React from 'react';

import styled from 'styled-components';
import LandingContent from '../../ui/layout/LandingContent';

import WrBrandText from '../brand/WrBrandText';
import WrSignin from '../signin/WrSignin';

const HeroHeader = styled.header`
  display: flex;
  width: 60%;
  min-height: 33vh;
  justify-content: center;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[4]};
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    width: 100%;
  }
`;

const Aside = styled.aside`
  display: flex;
  width: 40%;
  min-height: 33vh;
  justify-content: center;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[3]};
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    width: 100%;
  }
`;

const HeroHeading = styled.h1`
  font-size: 300%;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
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
      <HeroHeader>
        <HeroHeading>
          <em>Study with supercharged flashcards on </em><WrBrandText suffix="." />
        </HeroHeading>
      </HeroHeader>
      <Aside>
        <WrSignin />
      </Aside>
    </Article>
  </LandingContent>
);

export default WrLandingContent;
