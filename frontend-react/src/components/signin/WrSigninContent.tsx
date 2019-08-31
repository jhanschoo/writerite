import React from 'react';

import styled from 'styled-components';
import LandingContent from '../../ui/layout/LandingContent';

import WrSignin from './WrSignin';

const StyledLandingContent = styled(LandingContent)`
margin: ${({ theme }) => theme.space[3]} 0 0 0;
`;

const SigninBox = styled.div`
display: flex;
width: 40%;
justify-content: center;
align-items: center;
padding: ${({ theme }) => theme.space[1]};
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  width: 100%;
}
`;

const WrSigninContent = () => (
  <StyledLandingContent as="article">
    <SigninBox>
      <WrSignin />
    </SigninBox>
  </StyledLandingContent>
);

export default WrSigninContent;
