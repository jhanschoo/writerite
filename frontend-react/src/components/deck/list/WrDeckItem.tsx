// Visually similar to WrDeckDetailSubdeckItem
import React from "react";
import moment from "moment";

import { DeckScalars } from "src/client-models/gqlTypes/DeckScalars";

import { wrStyled } from "src/theme";
import { Item, MinimalButton, MinimalLink } from "src/ui";

const StyledItem = wrStyled(Item)`
flex-direction: column;
align-items: stretch;
width: 33%;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const DeckSummaryLink = wrStyled(MinimalLink)`
&.active, :hover {
  h4 {
    ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
  }
}
`;

const DeckSummaryButton = wrStyled(MinimalButton)`
text-align: left;

&.active, :hover {
  h4 {
    ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
  }
}
`;

const DeckSummaryBox = wrStyled.article`
flex-grow: 1;
min-width: 0;
display: flex;
flex-direction: column;
align-items: stretch;
margin: ${({ theme: { space } }) => `0 ${space[2]} ${space[3]} ${space[2]}`};
padding: 0;
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const DeckTitleBox = wrStyled.div`
display: flex;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};
justify-content: space-between;
align-items: baseline;

h4 {
  margin: 0;
  overflow: hidden;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
}
`;

const DeckStatistics = wrStyled.p`
font-weight: normal;
margin: ${({ theme: { space } }) => space[2]};
font-size: ${({ theme: { scale } }) => scale[0]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  deck: DeckScalars;
  onClick?: () => void;
}

const WrDeckItem = ({ deck, onClick }: Props): JSX.Element => {
  const now = moment.utc();
  const box =
    <DeckSummaryBox>
      <DeckTitleBox>
        <h4>{deck.name}</h4>
      </DeckTitleBox>
      <DeckStatistics>
        {`used ${moment.duration(moment.utc(deck.usedAt).diff(now)).humanize()} ago`}
        <br />
        {`edited ${moment.duration(moment.utc(deck.editedAt).diff(now)).humanize()} ago`}
      </DeckStatistics>
    </DeckSummaryBox>;
  return (
    <StyledItem key={deck.id}>
      {onClick
        ? <DeckSummaryButton onClick={() => onClick()}>
          {box}
        </DeckSummaryButton>
        : <DeckSummaryLink to={`/deck/${deck.id}`}>
          {box}
        </DeckSummaryLink>
      }
    </StyledItem>
  );
};

export default WrDeckItem;
