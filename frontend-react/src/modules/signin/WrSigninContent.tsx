import React from 'react';

import styled from 'styled-components';
import LandingContent from '../../ui/layout/LandingContent';

import WrSignin from './WrSignin';

const SigninBox = styled.div`
  display: flex;
  width: 40%;
  justify-content: center;
  align-content: center;
  background: ${({ theme }) => theme.colors.bg1};
  padding: ${({ theme }) => theme.space[3]};
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    width: 100%;
  }
`;

const WrSigninContent = (props: any) => (
  <LandingContent as="article" {...props}>
    <SigninBox>
      <WrSignin />
    </SigninBox>
  </LandingContent>
);

export default WrSigninContent;
