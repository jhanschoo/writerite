import React, { ReactNode } from "react";
import { wrStyled } from "../theme";
import { List } from "../ui";

export const FrontBackCardActionsList = wrStyled(List)`
flex-direction: row;
flex-wrap: wrap;
align-items: baseline;
justify-content: flex-end;
width: 100%;
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[1]} ${space[3]}`};
`;

const CardBox = wrStyled.div`
position: relative;
display: flex;
flex-wrap: wrap;
width: 100%;
padding: ${({ theme: { space } }) => `${space[2]} 0`};
`;

const StyledHeader = wrStyled.header`
display: flex;
width: 100%;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

h4, h5, h6 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `0 ${space[4]} 0 ${space[2]}`};
  margin: 0;
}
`;

const CardStatus = wrStyled.p`
position: absolute;
top: 0;
right: 0;
margin: ${({ theme: { space } }) => space[3]};
font-size: ${({ theme: { scale } }) => scale[0]};
`;

const FrontBox = wrStyled.section`
display: flex;
flex-direction: column;
width: 50%;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const BackBox = wrStyled.section`
display: flex;
flex-direction: column;
width: 50%;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => `0 ${space[2]}`};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  status?: string;
  header?: ReactNode;
  promptContent?: ReactNode;
  fullAnswerContent?: ReactNode;
  answersContent?: ReactNode;
  footer?: ReactNode;
}

export const FrontBackCard = ({
  // eslint-disable-next-line no-shadow
  status,
  header,
  promptContent,
  fullAnswerContent,
  answersContent,
  footer,
}: Props): JSX.Element =>
  <CardBox>
    {status && <CardStatus>{status}</CardStatus>}
    {header}
    <FrontBox>
      <StyledHeader>
        <h5>front</h5>
      </StyledHeader>
      <StyledContent>
        {promptContent}
      </StyledContent>
    </FrontBox>
    <BackBox>
      <StyledHeader>
        <h5>back</h5>
      </StyledHeader>
      <StyledContent>
        {fullAnswerContent}
      </StyledContent>
      <StyledHeader>
        <h6>other accepted answers</h6>
      </StyledHeader>
      <StyledContent>
        {answersContent}
      </StyledContent>
    </BackBox>
    {footer}
  </CardBox>;