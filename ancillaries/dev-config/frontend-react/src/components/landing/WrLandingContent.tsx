import React from "react";

import { wrStyled } from "src/theme";
import { LandingContent } from "src/ui";

import WrBrandText from "src/components/brand/WrBrandText";
import WrSignin from "src/components/signin/WrSignin";

const HeroHeader = wrStyled.header`
display: flex;
width: 60%;
min-height: 33vh;
justify-content: center;
align-items: center;
padding: 0 ${({ theme: { space } }) => space[4]};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const Aside = wrStyled.aside`
display: flex;
width: 40%;
min-height: 33vh;
justify-content: center;
align-items: center;
padding: 0 ${({ theme: { space } }) => space[3]};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const HeroHeading = wrStyled.h1`
font-size: 300%;
text-align: center;
margin: 0;
padding: 0 0 12.5% 0;

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[0]}) {
  font-size: 150%;
}
`;

const Article1 = wrStyled.article`
display: flex;
flex-wrap: wrap;
min-height: 67vh;
margin: ${({ theme: { space } }) => space[3]} 0 0 0;
`;

const Footer = wrStyled.footer`
display: flex;
flex-wrap: wrap;
min-height: 2em;
width: 100%;
margin: ${({ theme: { space } }) => space[3]} 0 0 0;
// ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
`;

const WrLandingContent = (): JSX.Element =>
  <LandingContent>
    <Article1>
      <HeroHeader>
        <HeroHeading>
          <em>Study with supercharged flashcards on </em><WrBrandText suffix="." />
        </HeroHeading>
      </HeroHeader>
      <Aside>
        <WrSignin />
      </Aside>
    </Article1>
    <Footer></Footer>
  </LandingContent>;
export default WrLandingContent;
