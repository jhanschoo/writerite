import React from "react";

import { wrStyled } from "../../theme";
import { LandingContent } from "../../ui";

import WrSignin from "./WrSignin";

const StyledLandingContent = wrStyled(LandingContent)`
margin: ${({ theme: { space } }) => space[3]} 0 0 0;
`;

const SigninBox = wrStyled.div`
display: flex;
width: 40%;
justify-content: center;
align-items: center;
padding: ${({ theme: { space } }) => space[1]};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const WrSigninContent = (): JSX.Element =>
  <StyledLandingContent as="article">
    <SigninBox>
      <WrSignin />
    </SigninBox>
  </StyledLandingContent>;
export default WrSigninContent;
